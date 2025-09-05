import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      studentId,
      counsellerId,
      firstName,
      lastName,
      email,
      sessionType,
      dateTime,
      note
    } = req.body;

    // Validate required fields
    if (!studentId || !counsellerId || !firstName || !lastName || !email || !sessionType || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(counsellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID or counseller ID format"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate date is in the future
    const appointmentDate = new Date(dateTime);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future"
      });
    }

    // Check for existing appointment at the same time for the same counselor
    const existingAppointment = await Appointment.findOne({
      counsellerId,
      dateTime: appointmentDate
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Counselor already has an appointment at this time"
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      studentId,
      counsellerId,
      firstName,
      lastName,
      email,
      sessionType,
      dateTime: appointmentDate,
      note: note || ""
    });

    const savedAppointment = await newAppointment.save();

    // Populate the references before sending response
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('studentId', 'firstName lastName email')
      .populate('counsellerId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: populatedAppointment
    });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all appointments with filtering and pagination
export const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      studentId,
      counsellerId,
      sessionType,
      startDate,
      endDate,
      sortBy = 'dateTime',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID format"
        });
      }
      filter.studentId = studentId;
    }

    if (counsellerId) {
      if (!mongoose.Types.ObjectId.isValid(counsellerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid counselor ID format"
        });
      }
      filter.counsellerId = counsellerId;
    }

    if (sessionType) {
      filter.sessionType = { $regex: sessionType, $options: 'i' };
    }

    // Date range filter
    if (startDate || endDate) {
      filter.dateTime = {};
      if (startDate) {
        filter.dateTime.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.dateTime.$lte = new Date(endDate);
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate('studentId', 'firstName lastName email')
      .populate('counsellerId', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination info
    const totalAppointments = await Appointment.countDocuments(filter);
    const totalPages = Math.ceil(totalAppointments / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalAppointments,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }

    const appointment = await Appointment.findById(id)
      .populate('studentId', 'firstName lastName email')
      .populate('counsellerId', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment retrieved successfully",
      data: appointment
    });

  } catch (error) {
    console.error("Error getting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }

    // Check if appointment exists
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Validate ObjectIds in updates if provided
    if (updates.studentId && !mongoose.Types.ObjectId.isValid(updates.studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format"
      });
    }

    if (updates.counsellerId && !mongoose.Types.ObjectId.isValid(updates.counsellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid counselor ID format"
      });
    }

    // Validate email if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
    }

    // Validate date if provided
    if (updates.dateTime) {
      const appointmentDate = new Date(updates.dateTime);
      if (appointmentDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Appointment date must be in the future"
        });
      }

      // Check for conflicts with other appointments (excluding current one)
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: id },
        counsellerId: updates.counsellerId || existingAppointment.counsellerId,
        dateTime: appointmentDate
      });

      if (conflictingAppointment) {
        return res.status(409).json({
          success: false,
          message: "Counselor already has an appointment at this time"
        });
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('studentId', 'firstName lastName email')
    .populate('counsellerId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment
    });

  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: deletedAppointment
    });

  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get upcoming appointments for a specific user (student or counselor)
export const getUpcomingAppointments = async (req, res) => {
  try {
    const { userId, userType } = req.params; // userType: 'student' or 'counselor'
    const { limit = 5 } = req.query;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Validate userType
    if (!['student', 'counselor'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "User type must be 'student' or 'counselor'"
      });
    }

    // Build filter based on user type
    const filter = {
      dateTime: { $gte: new Date() }
    };

    if (userType === 'student') {
      filter.studentId = userId;
    } else {
      filter.counsellerId = userId;
    }

    const upcomingAppointments = await Appointment.find(filter)
      .populate('studentId', 'firstName lastName email')
      .populate('counsellerId', 'firstName lastName email')
      .sort({ dateTime: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Upcoming appointments retrieved successfully",
      data: upcomingAppointments
    });

  } catch (error) {
    console.error("Error getting upcoming appointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get appointment statistics
export const getAppointmentStats = async (req, res) => {
  try {
    const { counsellerId, startDate, endDate } = req.query;

    // Build match stage for aggregation
    const matchStage = {};
    
    if (counsellerId) {
      if (!mongoose.Types.ObjectId.isValid(counsellerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid counselor ID format"
        });
      }
      matchStage.counsellerId = new mongoose.Types.ObjectId(counsellerId);
    }

    if (startDate || endDate) {
      matchStage.dateTime = {};
      if (startDate) matchStage.dateTime.$gte = new Date(startDate);
      if (endDate) matchStage.dateTime.$lte = new Date(endDate);
    }

    const stats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          sessionTypes: { $addToSet: "$sessionType" },
          upcomingAppointments: {
            $sum: {
              $cond: [{ $gte: ["$dateTime", new Date()] }, 1, 0]
            }
          },
          pastAppointments: {
            $sum: {
              $cond: [{ $lt: ["$dateTime", new Date()] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalAppointments: 1,
          upcomingAppointments: 1,
          pastAppointments: 1,
          sessionTypesCount: { $size: "$sessionTypes" },
          sessionTypes: 1
        }
      }
    ]);

    // Get appointments by session type
    const sessionTypeStats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$sessionType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: "Appointment statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalAppointments: 0,
          upcomingAppointments: 0,
          pastAppointments: 0,
          sessionTypesCount: 0,
          sessionTypes: []
        },
        sessionTypeBreakdown: sessionTypeStats
      }
    });

  } catch (error) {
    console.error("Error getting appointment statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};