import { AppDataSource } from "../data-source";
import { Booking } from "../entities/booking.entity";
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
});
