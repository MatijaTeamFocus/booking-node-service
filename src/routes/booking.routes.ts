import BookingController from "../controllers/booking/booking.controller";
import { auth } from "../middlewares/auth.middleware";
import express from "express";

const Router = express.Router();

Router.post("/", auth, BookingController.createBooking);
Router.get("/", auth, BookingController.getBookings);
Router.patch("/:id", auth, BookingController.updateBooking);
Router.delete("/:id", auth, BookingController.deleteBooking);

export { Router as bookingRouter };
