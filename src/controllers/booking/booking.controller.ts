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

      const bookingRepository = AppDataSource.getRepository(Booking);
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
      const newBooking = bookingRepository.create({
        startDateTime,
        endDateTime,
        createdByUser: user,
        parkingSpot,
      });

      const savedBooking = await bookingRepository.save(newBooking);

      return res.status(200).send({
        id: savedBooking.id,
        startDateTime: savedBooking.startDateTime,
        endDateTime: savedBooking.endDateTime,
      });
    } catch (error) {
      console.error(error);
      return super.handleErrorResponse(res, error);
    }
  }

  async getBookings(req: Request, res: Response): Promise<Response> {
    try {
      // Extract parameters
      const {
        id,
        startDateTimeFrom,
        startDateTimeTo,
        endDateTimeFrom,
        endDateTimeTo,
        parkingSpotId,
        page,
        pageSize,
        sortBy,
        sortOrder,
        user,
      } = new GetBookingsRequest(req);

      const bookingRepository = AppDataSource.getRepository(Booking);
      // Build the query based on the provided parameters
      const queryBuilder = bookingRepository.createQueryBuilder("booking");
      if (id) {
        queryBuilder.andWhere("booking.id = :id", { id });
      }
      if (startDateTimeFrom && startDateTimeTo) {
        queryBuilder.andWhere(
          "booking.start_date_time BETWEEN :startDateTimeFrom AND :startDateTimeTo",
          {
            startDateTimeFrom,
            startDateTimeTo,
          }
        );
      }
      if (endDateTimeFrom && endDateTimeTo) {
        queryBuilder.andWhere(
          "booking.end_date_time BETWEEN :endDateTimeFrom AND :endDateTimeTo",
          {
            endDateTimeFrom,
            endDateTimeTo,
          }
        );
      }
      if (parkingSpotId) {
        queryBuilder.andWhere("booking.parkingSpotId = :parkingSpotId", {
          parkingSpotId,
        });
      }
      if (user.role === "Standard") {
        queryBuilder.andWhere("booking.created_by_user_id = :userId", {
          userId: user.id,
        });
      }

      // Apply sorting
      queryBuilder.orderBy(`booking.${sortBy}`, sortOrder);

      // Apply pagination
      queryBuilder.skip((page - 1) * pageSize).take(pageSize);

      // Find bookings based on the query
      const bookings = await queryBuilder.getMany();

      return res.status(200).send({ bookings });
    } catch (error) {
      console.error(error);
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
      const updateQuery: any = {};
      if (startDateTime) {
        if (new Date(startDateTime) < new Date(booking.startDateTime)) {
          checkForExistentBooking = true;
        }
        updateQuery["startDateTime"] = startDateTime;
        booking.startDateTime = new Date(startDateTime);
      }
      if (endDateTime) {
        if (new Date(endDateTime) > new Date(booking.endDateTime)) {
          checkForExistentBooking = true;
        }
        updateQuery["endDateTime"] = endDateTime;
        booking.endDateTime = new Date(endDateTime);
      }
      if (new Date(booking.startDateTime) > new Date(booking.endDateTime)) {
        throw BAD_REQUEST.withMessage("Start date time cannot be greater than end date time");
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

      const bookingRepository = AppDataSource.getRepository(Booking);
      const updateQueryBuilder =
        bookingRepository.createQueryBuilder("booking");
      await updateQueryBuilder
        .update()
        .set(updateQuery)
        .where("booking.id = :id", { id })
        .execute();

      return res.status(200).send({
        id: booking.id,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
      });
    } catch (error) {
      console.error(error);
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

      const bookingRepository = AppDataSource.getRepository(Booking);
      await bookingRepository.delete(id);

      return res.status(200).send({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error(error);
      return super.handleErrorResponse(res, error);
    }
  }
}

export default new BookingController();
