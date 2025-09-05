import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments,
  getAppointmentStats
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Middleware for request validation (optional - add if you have auth middleware)
// import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
// import { validateAppointmentInput } from "../middleware/validation.js";

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Student/Admin)
router.post("/", createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments with filtering and pagination
// @access  Private (Admin/Counselor)
// Query parameters: page, limit, studentId, counsellerId, sessionType, startDate, endDate, sortBy, sortOrder
router.get("/", getAllAppointments);

// @route   GET /api/appointments/stats
// @desc    Get appointment statistics
// @access  Private (Admin/Counselor)
// Query parameters: counsellerId, startDate, endDate
router.get("/stats", getAppointmentStats);

// @route   GET /api/appointments/upcoming/:userType/:userId
// @desc    Get upcoming appointments for a specific user
// @access  Private (Owner/Admin)
// Params: userType (student/counselor), userId
// Query parameters: limit
router.get("/upcoming/:userType/:userId", getUpcomingAppointments);

// @route   GET /api/appointments/:id
// @desc    Get single appointment by ID
// @access  Private (Owner/Admin/Counselor)
router.get("/:id", getAppointmentById);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private (Owner/Admin)
router.put("/:id", updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (Owner/Admin)
router.delete("/:id", deleteAppointment);

export default router;