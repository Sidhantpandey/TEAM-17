import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  entryText: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // e.g., ["stress", "anxiety"]
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
