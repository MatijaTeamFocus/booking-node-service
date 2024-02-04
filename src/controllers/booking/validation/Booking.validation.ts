import { default as joi } from "joi";

export const createBookingRequest = joi.object({
  startDateTime: joi.date().min("now").required(),
  endDateTime: joi.date().min(joi.ref("startDateTime")).required(),
  parkingSpotId: joi.number().required(),
  user: joi.object().required(),
});

export const getBookingsRequest = joi.object({
  id: joi.number().positive().optional(),
  startDateTimeFrom: joi.date().optional(),
  startDateTimeTo: joi.date().optional(),
  endDateTimeFrom: joi.date().optional(),
  endDateTimeTo: joi.date().optional(),
  parkingSpotId: joi.number().positive().optional(),
  page: joi.number().positive().default(1).optional(),
  pageSize: joi.number().positive().default(10).optional(),
  sortBy: joi
    .string()
    .valid("startDateTime", "endDateTime", "createdAt", "updatedAt")
    .default("startDateTime")
    .optional(),
  sortOrder: joi.string().valid("ASC", "DESC").default("ASC").optional(),
});

export const updateBookingRequest = joi
  .object({
    startDateTime: joi.date().min("now").optional(),
    endDateTime: joi.date().when("startDateTime", {
      is: joi.date().required(),
      then: joi.date().min(joi.ref("startDateTime")).optional(),
      otherwise: joi.date().min("now").optional(),
    }),
    user: joi.object().required(),
  })
  .or("startDateTime", "endDateTime");

export const bookingIdParam = joi.object({
  id: joi.number().positive().required(),
});
