import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const appointments = async (req, res) => {
  try {
    const { role, id } = req.user;

    let appointments = [];

    if (role === "STUDENT") {
      appointments = await prisma.appointment.findMany({
        where: { studentId: id },
        include: { counsellor: { include: { user: true } } },
      });
    } else if (role === "COUNSELLOR") {
      const counsellor = await prisma.counsellor.findUnique({
        where: { userId: id },
      });
      if (!counsellor)
        return res.status(403).json({ error: "Not a counsellor" });

      appointments = await prisma.appointment.findMany({
        where: { counsellorId: counsellor.id },
        include: { student: true },
      });
    } else if (role === "ADMIN" || role === "VOLUNTEER") {
      // Volunteer can view everything, same as Admin, but cannot modify users
      appointments = await prisma.appointment.findMany({
        include: { student: true, counsellor: { include: { user: true } } },
      });
    } else {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const availability = async (req, res) => {
  try {
    const { weekday, startTime, endTime } = req.body;
    const { id } = req.user;

    const counsellor = await prisma.counsellor.findUnique({
      where: { userId: id },
    });
    if (!counsellor) return res.status(403).json({ error: "Not a counsellor" });

    const availability = await prisma.availability.create({
      data: {
        counsellorId: counsellor.id,
        weekday,
        startTime,
        endTime,
      },
    });

    res.json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create availability" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Cascade delete appointments and counsellor profile if exists
    await prisma.appointment.deleteMany({
      where: { OR: [{ studentId: userId }, { counsellor: { userId } }] },
    });

    await prisma.counsellor.deleteMany({
      where: { userId },
    });

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
