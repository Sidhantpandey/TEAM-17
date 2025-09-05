import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  updatePassword,
  deleteUser,
  deleteMultipleUsers,
  getUserStats
} from "../controllers/auth.controllers.js";

const router = express.Router();


router.post("/", createUser);

// READ Routes
// GET /api/users - Get all users with optional filtering and pagination
// Query params: ?role=STUDENT&gender=male&college=xyz&page=1&limit=10
router.get("/", getAllUsers);

// GET /api/users/stats - Get user statistics
router.get("/stats", getUserStats);

// GET /api/users/role/:role - Get users by specific role
// Example: /api/users/role/STUDENT
router.get("/role/:role", getUsersByRole);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

// UPDATE Routes
// PUT /api/users/:id - Update user profile
router.put("/:id", updateUser);

// PUT /api/users/:id/password - Update user password
router.put("/:id/password", updatePassword);

// DELETE Routes
// DELETE /api/users/:id - Delete single user
router.delete("/:id", deleteUser);

// DELETE /api/users - Delete multiple users
// Body: { "userIds": ["id1", "id2", "id3"] }
router.delete("/", deleteMultipleUsers);

export default router;