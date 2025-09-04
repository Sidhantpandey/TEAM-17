import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (default role = STUDENT if none provided)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role || "STUDENT",
      },
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.passwordHash)
      return res.status(500).json({ error: "User password not set" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
