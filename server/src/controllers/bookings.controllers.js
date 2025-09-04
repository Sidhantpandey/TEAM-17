import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import ical from "ical-generator";
import "dotenv/config";
import transporter from "../services/mail.services.js";

const redis = new Redis(process.env.REDIS_URL);
const router = express.Router();

const LOCK_TTL_MS = 30_000;

// Acquire lock
async function acquireLock(key) {
  const token = uuidv4();
  const ok = await redis.set(key, token, "NX", "PX", LOCK_TTL_MS);
  return ok ? token : null;
}

// Release lock
async function releaseLock(key, token) {
  const lua = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  try {
    await redis.eval(lua, 1, key, token);
  } catch (e) {
    console.error("releaseLock err", e);
  }
}

// Utility: generate Jitsi link
function generateJitsiLink(counsellorId) {
  const room = `campus-${counsellorId}-${Date.now()}`;
  return `https://meet.jit.si/${encodeURIComponent(room)}`;
}

// Utility: generate ICS file
async function generateIcsAndReturnLink({
  title,
  description,
  start,
  end,
  location,
  emails,
}) {
  const cal = ical({ domain: "yourdomain.edu", name: title });
  cal.createEvent({
    start,
    end,
    summary: title,
    description,
    location,
    attendees: (emails || []).map((e) => ({ email: e })),
  });
  const ics = cal.toString();
  return "data:text/calendar;base64," + Buffer.from(ics).toString("base64");
}

// Availability
export const availability = async (req, res) => {
  const counsellorId = String(req.params.id);
  const dateStr = String(
    req.query.date || new Date().toISOString().slice(0, 10)
  );

  const counsellor = await prisma.counsellor.findUnique({
    where: { id: counsellorId },
    include: { availability: true },
  });

  if (!counsellor)
    return res.status(404).json({ error: "counsellor not found" });

  const targetDate = new Date(dateStr + "T00:00:00Z");
  const weekday = targetDate.getUTCDay();

  const availForDay = counsellor.availability.filter(
    (a) => a.weekday === weekday
  );

  const dayStart = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      0,
      0,
      0
    )
  );
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);

  const existing = await prisma.appointment.findMany({
    where: {
      counsellorId,
      startAt: { gte: dayStart },
      endAt: { lte: dayEnd },
      status: "SCHEDULED",
    },
  });

  const durationMin = counsellor.defaultDuration || 30;
  const slots = [];

  for (const a of availForDay) {
    const [hStart, mStart] = a.startTime.split(":").map(Number);
    const [hEnd, mEnd] = a.endTime.split(":").map(Number);

    const rangeStart = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        hStart,
        mStart
      )
    );
    const rangeEnd = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        hEnd,
        mEnd
      )
    );

    for (
      let s = new Date(rangeStart.getTime());
      s.getTime() + durationMin * 60000 <= rangeEnd.getTime();
      s = new Date(s.getTime() + durationMin * 60000)
    ) {
      const e = new Date(s.getTime() + durationMin * 60000);
      const conflict = existing.some(
        (ap) => !(ap.endAt <= s || ap.startAt >= e)
      );
      slots.push({
        start: s.toISOString(),
        end: e.toISOString(),
        isFree: !conflict,
      });
    }
  }

  return res.json({ slots });
};

//Booking Controller
export const booking = async (req, res) => {
  const {
    counsellorId,
    sessionToken,
    studentId,
    startAt,
    mode,
    optionalNote,
    studentEmail,
  } = req.body;

  if (!counsellorId || !startAt || !mode)
    return res.status(400).json({ error: "missing fields" });

  // Helpline path
  if (mode === "HELPLINE") {
    const helplines = [
      {
        country: "India",
        number: "+91-XXXXXXXXXX",
        label: "Campus Helpline (24/7)",
      },
    ];
    return res.json({
      helplines,
      message: "If you are in immediate danger call emergency services first.",
    });
  }

  const counsellor = await prisma.counsellor.findUnique({
    where: { id: counsellorId },
  });
  if (!counsellor)
    return res.status(404).json({ error: "counsellor not found" });

  const start = new Date(startAt);
  const end = new Date(
    start.getTime() + (counsellor.defaultDuration || 30) * 60000
  );

  const lockKey = `slot:${counsellorId}:${start.toISOString()}`;
  const lockToken = await acquireLock(lockKey);
  if (!lockToken)
    return res.status(409).json({ error: "slot locked, try again" });

  try {
    const conflict = await prisma.appointment.findFirst({
      where: {
        counsellorId,
        status: "SCHEDULED",
        OR: [
          { startAt: { lte: start }, endAt: { gt: start } },
          { startAt: { lt: end }, endAt: { gte: end } },
          { startAt: { gte: start }, endAt: { lte: end } },
        ],
      },
    });
    if (conflict) return res.status(409).json({ error: "slot already taken" });

    let meetingLink = null;
    let location = "On-Campus"; // default for offline

    if (mode === "VIDEO") {
      meetingLink = generateJitsiLink(counsellorId);
      location = meetingLink;
    } else if (mode === "OFFLINE") {
      location = counsellor.officeLocation || "Campus Counselling Center";
    }
    const prismaMode = mode === "OFFLINE" ? "VIDEO" : mode; // Prisma expects enum names

    const appointment = await prisma.appointment.create({
      data: {
        counsellorId,
        studentId: studentId || null,
        sessionToken: sessionToken || null,
        mode: prismaMode,
        startAt: start,
        endAt: end,
        meetingLink: meetingLink || undefined,
      },
    });

    const icsLink = await generateIcsAndReturnLink({
      title: `Counselling with ${counsellor.displayName}`,
      description: optionalNote || "",
      start,
      end,
      location,
      emails: studentEmail ? [studentEmail] : [],
    });

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { icsLink },
    });

    // Notifications
    try {
      const counsellorUser = await prisma.user.findUnique({
        where: { id: counsellor.userId },
      });

      await transporter.sendMail({
        from: `"Campus Counselling" <${process.env.SENDER_EMAIL}>`,
        to: counsellorUser?.email || "counsellor@example.com",
        subject: `New booking: ${start.toISOString()}`,
        text: `A new appointment has been scheduled.\nMode: ${mode}\nLocation: ${location}\nNotes: ${
          optionalNote || ""
        }`,
      });

      if (studentEmail) {
        await transporter.sendMail({
          from: `"Campus Counselling" <${process.env.SENDER_EMAIL}>`,
          to: studentEmail,
          subject: `Your appointment confirmed — ${start.toISOString()}`,
          text: `Your appointment is confirmed.\nMode: ${mode}\nLocation: ${location}`,
        });
      }
    } catch (e) {
      console.warn("email send fail", e);
    }

    return res.json({ appointmentId: appointment.id, meetingLink, icsLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  } finally {
    await releaseLock(lockKey, lockToken);
  }
};
