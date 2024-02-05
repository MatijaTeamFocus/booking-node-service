import { BAD_REQUEST, NOT_FOUND } from "../../constants/error.constants";
import { Request, Response } from "express";

import { AppDataSource } from "../../data-source";
import { BaseController } from "../base/base.controller";
import { Booking } from "../../entities/booking.entity";
import { BookingRepository } from "../../repositories/booking.repository";
import { CreateBookingRequest } from "./requests/CreateBooking.request";
import { DeleteBookingRequest } from "./requests/DeleteBooking.request";
import { GetBookingsRequest } from "./requests/GetBookings.request";
import { ParkingSpot } from "../../entities/parking-spot.entity";
import { UpdateBookingRequest } from "./requests/UpdateBooking.request";
import { UserRole } from "../../entities/user.entity";

class BookingController extends BaseController {
  async createBooking(req: Request, res: Response): Promise<Response> {
    try {
      // Extract parameters
      const { startDateTime, endDateTime, parkingSpotId, user } =
        new CreateBookingRequest(req);

      const parkingSpotRepository = AppDataSource.getRepository(ParkingSpot);

      // Check if the parking spot exists
      const parkingSpot = await parkingSpotRepository.findOne({
        where: { id: parkingSpotId },
      });

      if (!parkingSpot) {
        throw NOT_FOUND.withMessage("Parking spot not found");
      }

      // Check if there is any booking for the same parking spot with overlapping time
      const existentBooking = await BookingRepository.checkForExistentBooking(
        startDateTime,
        endDateTime,
        parkingSpot.id
      );

      if (existentBooking) {
        const responseData: any = {
          message: "Booking conflicts with existing booking",
          existentBooking: {
            startDateTime: existentBooking.startDateTime,
            endDateTime: existentBooking.endDateTime,
          },
        };
        if (user.role === UserRole.Standard) {
          responseData.existentBooking =
            existentBooking.createdByUserId !== user.id
              ? undefined
              : responseData.existentBooking;
        }
        throw BAD_REQUEST.withDetails(responseData);
      }

      // Validation passed, proceed with creating and saving the booking
      const newBooking = BookingRepository.create({
        startDateTime,
        endDateTime,
        createdByUser: user,
        parkingSpot,
      });

      const savedBooking = await BookingRepository.save(newBooking);

      return res.status(200).send(savedBooking.toResponse());
    } catch (error) {
      return super.handleErrorResponse(res, error);
    }
  }

  async getBookings(req: Request, res: Response): Promise<Response> {
    try {
      // Extract parameters
      const getBookingsRequest = new GetBookingsRequest(req);

      // Get bookings
      const bookings = await BookingRepository.getBookings(getBookingsRequest);

      return res.status(200).send({
        bookings: bookings.map((booking: Booking) => {
          return booking.toResponse();
        }),
      });
    } catch (error) {
      return super.handleErrorResponse(res, error);
    }
  }

  async updateBooking(req: Request, res: Response): Promise<Response> {
    try {
      // Extract parameters
      const { id, startDateTime, endDateTime, user } = new UpdateBookingRequest(
        req
      );

      const booking = await BookingRepository.findById(id, user);
      if (!booking) {
        throw NOT_FOUND.withMessage("Booking not found");
      }

      let checkForExistentBooking = false;
      const updateQuery: { startDateTime?: Date; endDateTime?: Date } = {};
      if (startDateTime) {
        if (new Date(startDateTime) < new Date(booking.startDateTime)) {
          checkForExistentBooking = true;
        }
        updateQuery.startDateTime = startDateTime;
        booking.startDateTime = new Date(startDateTime);
      }
      if (endDateTime) {
        if (new Date(endDateTime) > new Date(booking.endDateTime)) {
          checkForExistentBooking = true;
        }
        updateQuery.endDateTime = endDateTime;
        booking.endDateTime = new Date(endDateTime);
      }
      if (new Date(booking.startDateTime) > new Date(booking.endDateTime)) {
        throw BAD_REQUEST.withMessage(
          "Start date time cannot be greater than end date time"
        );
      }

      if (checkForExistentBooking) {
        const existentBooking = await BookingRepository.checkForExistentBooking(
          booking.startDateTime,
          booking.endDateTime,
          booking.parkingSpotId,
          booking.id
        );
        if (existentBooking) {
          const responseData: any = {
            message: "Booking conflicts with existing booking",
            existentBooking: {
              startDateTime: existentBooking.startDateTime,
              endDateTime: existentBooking.endDateTime,
            },
          };
          if (user.role === UserRole.Standard) {
            responseData.existentBooking =
              existentBooking.createdByUserId !== user.id
                ? undefined
                : responseData.existentBooking;
          }
          throw BAD_REQUEST.withDetails(responseData);
        }
      }

      await BookingRepository.updateBookingTime(id, updateQuery);

      return res.status(200).send(booking.toResponse());
    } catch (error) {
      return super.handleErrorResponse(res, error);
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<Response> {
    try {
      // Extract parameters
      const { id, user } = new DeleteBookingRequest(req);

      const booking = await BookingRepository.findById(id, user);
      if (!booking) {
        throw NOT_FOUND.withMessage("Booking not found");
      }

      await BookingRepository.delete(id);

      return res.status(200).send({ message: "Booking deleted successfully" });
    } catch (error) {
      return super.handleErrorResponse(res, error);
    }
  }
}

export default new BookingController();
