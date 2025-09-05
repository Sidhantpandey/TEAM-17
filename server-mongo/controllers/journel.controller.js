import Journal from "../models/journal.js";

// Create a new journal entry
export const createEntry = async (req, res) => {
  try {
    const { nickname, entryText, tags } = req.body;

    const newEntry = new Journal({
      nickname,
      entryText,
      tags,
    });

    await newEntry.save();
    res.status(201).json({ message: "Journal entry created successfully", entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Failed to create entry", error });
  }
};

// Get all entries (optional: for admin dashboard)
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch entries", error });
  }
};

// Get entries by nickname
export const getEntriesByNickname = async (req, res) => {
  try {
    const { nickname } = req.params;
    const entries = await Journal.find({ nickname }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch entries", error });
  }
};

// Delete entry (optional)
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await Journal.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete entry", error });
  }
};
