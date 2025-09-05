import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    profile: {
      type: String,
      required: false
    },
    college: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "VOLUNTEER", "COUNSELLER"],
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
