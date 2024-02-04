import { JoiValidation } from "../../../utils/validation.util";
import { Request } from "express";
import { User } from "../../../entities/user.entity";
import { bookingIdParam } from "../validation/Booking.validation";

export class DeleteBookingRequest {
    public id: number;
    public user: User;

    constructor(request: Request) {
        const params = JoiValidation.validate(bookingIdParam, request.params);

        this.id = params.id;
        this.user = request.body.user; 
    }
}