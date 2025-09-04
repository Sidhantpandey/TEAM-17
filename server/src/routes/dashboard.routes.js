import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import express from "express";
import * as dashboardControllers from "../controllers/dashboard.controllers.js";
const router = express.Router();

/**
 * GET /appointments
 * - STUDENT → see only their own appointments
 * - COUNSELLOR → see only their assigned appointments
 * - ADMIN → see all appointments
 * - VOLUNTEER → see all appointments (read-only, no modification rights)
 */
router.get("/appointments", authenticate, dashboardControllers.appointments);

/**
 * POST /availability
 * - Only COUNSELLOR
 */
router.post(
  "/availability",
  authenticate,
  authorize("COUNSELLOR"),
  dashboardControllers.availability
);

/**
 * DELETE /users/:id
 * - Only ADMIN
 * - VOLUNTEER cannot delete users
 */
router.delete(
  "/users/:id",
  authenticate,
  authorize("ADMIN"),
  dashboardControllers.deleteUser
);

export default router;
