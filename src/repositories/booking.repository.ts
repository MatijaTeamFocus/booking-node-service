import { AppDataSource } from "../data-source";
import { Booking } from "../entities/booking.entity";
import { GetBookingsRequest } from "../controllers/booking/requests/GetBookings.request";
import { User } from "../entities/user.entity";

export const BookingRepository = AppDataSource.getRepository(Booking).extend({
  checkForExistentBooking(
    startDateTime: Date,
    endDateTime: Date,
    parkingSpotId: number,
    id?: number
  ) {
    const queryBuilder = this.createQueryBuilder("booking");
    if (id) {
      queryBuilder.andWhere("booking.id != :id", { id });
    }

    return queryBuilder
      .andWhere("booking.parking_spot_id = :parkingSpotId", {
        parkingSpotId,
      })
      .andWhere(
        `((booking.start_date_time >= :startDateTime AND booking.start_date_time <= :endDateTime) OR ` +
          `(booking.end_date_time >= :startDateTime AND booking.end_date_time <= :endDateTime) OR ` +
          `(booking.start_date_time <= :startDateTime AND booking.end_date_time >= :endDateTime) OR ` +
          `(booking.start_date_time >= :startDateTime AND booking.end_date_time <= :endDateTime) OR ` +
          `(booking.start_date_time = :startDateTime AND booking.end_date_time = :endDateTime))`,
        {
          startDateTime: startDateTime,
          endDateTime: endDateTime,
        }
      )
      .getOne();
  },
  findById(id: number, user: User) {
    const queryBuilder = this.createQueryBuilder("booking").where(
      "booking.id = :id",
      { id }
    );

    if (user.role === "Standard") {
      queryBuilder.andWhere("booking.created_by_user_id = :userId", {
        userId: user.id,
      });
    }
    return queryBuilder.getOne();
  },
  updateBookingTime(
    id: number,
    updateQuery: { startDateTime?: Date; endDateTime?: Date }
  ) {
    const updateQueryBuilder = this.createQueryBuilder("booking");
    return updateQueryBuilder
      .update()
      .set(updateQuery)
      .where("booking.id = :id", { id })
      .execute();
  },
  getBookings(getBookingsRequest: GetBookingsRequest) {
    const queryBuilder = this.createQueryBuilder("booking");
    if (getBookingsRequest.id) {
      queryBuilder.andWhere("booking.id = :id", { id: getBookingsRequest.id });
    }
    if (
      getBookingsRequest.startDateTimeFrom &&
      getBookingsRequest.startDateTimeTo
    ) {
      queryBuilder.andWhere(
        "booking.start_date_time BETWEEN :startDateTimeFrom AND :startDateTimeTo",
        {
          startDateTimeFrom: getBookingsRequest.startDateTimeFrom,
          startDateTimeTo: getBookingsRequest.startDateTimeTo,
        }
      );
    }
    if (
      getBookingsRequest.endDateTimeFrom &&
      getBookingsRequest.endDateTimeTo
    ) {
      queryBuilder.andWhere(
        "booking.end_date_time BETWEEN :endDateTimeFrom AND :endDateTimeTo",
        {
          endDateTimeFrom: getBookingsRequest.endDateTimeFrom,
          endDateTimeTo: getBookingsRequest.endDateTimeTo,
        }
      );
    }
    if (getBookingsRequest.parkingSpotId) {
      queryBuilder.andWhere("booking.parkingSpotId = :parkingSpotId", {
        parkingSpotId: getBookingsRequest.parkingSpotId,
      });
    }
    if (getBookingsRequest.user.role === "Standard") {
      queryBuilder.andWhere("booking.created_by_user_id = :userId", {
        userId: getBookingsRequest.user.id,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(
      `booking.${getBookingsRequest.sortBy}`,
      getBookingsRequest.sortOrder
    );

    // Apply pagination
    queryBuilder
      .skip((getBookingsRequest.page - 1) * getBookingsRequest.pageSize)
      .take(getBookingsRequest.pageSize);

    return queryBuilder.getMany();
  },
});
