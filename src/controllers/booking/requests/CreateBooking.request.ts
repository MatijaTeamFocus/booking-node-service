import { JoiValidation } from "../../../utils/validation.util";
import { Request } from "express";
import { User } from "../../../entities/user.entity";
import { createBookingRequest } from "../validation/Booking.validation";

export class CreateBookingRequest {
  public startDateTime: Date;
  public endDateTime: Date;
  public parkingSpotId: number;
  public user: User;

  constructor(request: Request) {
    const body = JoiValidation.validate(createBookingRequest, request.body);

    this.startDateTime = body.startDateTime;
    this.endDateTime = body.endDateTime;
    this.parkingSpotId = body.parkingSpotId;
    this.user = body.user;
  }
}
