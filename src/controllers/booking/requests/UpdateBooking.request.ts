import { bookingIdParam, updateBookingRequest } from "../validation/Booking.validation";

import { JoiValidation } from "../../../utils/validation.util";
import { Request } from "express";
import { User } from "../../../entities/user.entity";

export class UpdateBookingRequest {
    public id: number;
    public startDateTime?: Date;
    public endDateTime?: Date;
    public user: User;

    constructor(request: Request) {
        const body = JoiValidation.validate(updateBookingRequest, request.body);
        const params = JoiValidation.validate(bookingIdParam, request.params);

        this.id = params.id;
        this.startDateTime = body.startDateTime;
        this.endDateTime = body.endDateTime;
        this.user = body.user; 
    }
}