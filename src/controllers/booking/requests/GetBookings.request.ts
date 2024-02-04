import { JoiValidation } from "../../../utils/validation.util";
import { User } from "../../../entities/user.entity";
import { getBookingsRequest } from "../validation/Booking.validation";

export class GetBookingsRequest {
  public id?: number;
  public startDateTimeFrom?: Date;
  public startDateTimeTo?: Date;
  public endDateTimeFrom?: Date;
  public endDateTimeTo?: Date;
  public parkingSpotId?: number;
  public page: number;
  public pageSize: number;
  public sortBy: SortBy;
  public sortOrder: SortOrder;
  public user: User;

  constructor(request: any) {
    const query = JoiValidation.validate(getBookingsRequest, request.query);

    this.id = query.id;
    this.startDateTimeFrom = query.startDateTimeFrom;
    this.startDateTimeTo = query.startDateTimeTo;
    this.endDateTimeFrom = query.endDateTimeFrom;
    this.endDateTimeTo = query.endDateTimeTo;
    this.parkingSpotId = query.parkingSpotId;
    this.page = query.page;
    this.pageSize = query.pageSize;
    this.sortBy = query.sortBy;
    this.sortOrder = query.sortOrder;
    this.user = request.body.user;
  }
}

enum SortBy {
  startDateTime = "startDateTime",
  endDateTime = "endDateTime",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}

enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
