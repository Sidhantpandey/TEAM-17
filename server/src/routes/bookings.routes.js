import express from "express";
import * as bookingController from "../controllers/bookings.controllers.js";
const router = express.Router();

router
  .route("/counsellors/:id/availability")
  .post(bookingController.availability);

router.route("/book-counsellor").post(bookingController.booking);

export default router;