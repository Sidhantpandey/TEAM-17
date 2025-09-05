import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    counsellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    sessionType: {
      type: String,
      required: true,
      trim: true
    },
    dateTime: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      required: false,
      trim: true
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;