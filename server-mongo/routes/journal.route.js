import express from "express";
import { createEntry, getAllEntries, getEntriesByNickname, deleteEntry } from "../controllers/journalController.js";

const router = express.Router();

// Create journal entry
router.post("/create", createEntry);

// Get all entries (admin dashboard)
router.get("/", getAllEntries);

// Get entries by nickname
router.get("/:nickname", getEntriesByNickname);

// Delete entry
router.delete("/:id", deleteEntry);

export default router;
