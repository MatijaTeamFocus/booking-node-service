import { describe, expect, test } from "@jest/globals";

import { CreateBookingRequest } from "../../controllers/booking/requests/CreateBooking.request";
import { DeleteBookingRequest } from "../../controllers/booking/requests/DeleteBooking.request";
import { GetBookingsRequest } from "../../controllers/booking/requests/GetBookings.request";
import { UpdateBookingRequest } from "../../controllers/booking/requests/UpdateBooking.request";
import { standardUser } from "../data/constants";

describe("Testing joi validation for CreateBookingRequest class", () => {
  test("Passing validation", () => {
    const testData = [
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          parkingSpotId: 1,
          user: standardUser,
        },
      },
    ];

    testData.forEach((data) => {
      const request = { body: data.body };
      const CreateBookingRequestPostFunction = () => {
        new CreateBookingRequest(request as any);
      };
      expect(CreateBookingRequestPostFunction).not.toThrow();
    });
  });

  test("Failing validation", () => {
    const testData = [
      {
        body: {
          endDateTime: "2024-03-03T16:00:00Z",
          parkingSpotId: 1,
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          parkingSpotId: 1,
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          parkingSpotId: 1,
        },
      },
      {
        body: {
          startDateTime: true,
          endDateTime: "2024-03-03T16:00:00Z",
          parkingSpotId: 1,
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "INVALID DATE",
          parkingSpotId: 1,
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          parkingSpotId: "INVALID PARKING SPOT ID",
          user: standardUser,
        },
      },
    ];

    testData.forEach((data) => {
      const request = { body: data.body };
      const CreateBookingRequestPostFunction = (): void => {
        new CreateBookingRequest(request as any);
      };
      expect(CreateBookingRequestPostFunction).toThrow();
    });
  });
});

describe("Testing joi validation for GetBookingsRequest class", () => {
  test("Passing validation", () => {
    const testData = [
      {
        query: {},
      },
      {
        query: {
          id: 1,
        },
      },
      {
        query: {
          parkingSpotId: 1,
        },
      },
      {
        query: {
          startDateTimeFrom: "2024-03-03T15:00:00Z",
          startDateTimeTo: "2024-03-03T16:00:00Z",
        },
      },
      {
        query: {
          endDateTimeFrom: "2024-03-03T15:00:00Z",
          endDateTimeTo: "2024-03-03T16:00:00Z",
        },
      },
      {
        query: {
          startDateTimeFrom: "2024-03-03T14:00:00Z",
          startDateTimeTo: "2024-03-03T15:00:00Z",
          endDateTimeFrom: "2024-03-03T15:00:00Z",
          endDateTimeTo: "2024-03-03T16:00:00Z",
        },
      },
      {
        query: {
          parkingSpotId: 1,
          page: 1,
          pageSize: 10,
        },
      },
      {
        query: {
          parkingSpotId: 1,
          sortBy: "startDateTime",
          sortOrder: "ASC",
        },
      },
    ];

    testData.forEach((data) => {
      const request = { query: data.query, body: { user: standardUser } };
      const GetBookingsRequestGetFunction = () => {
        new GetBookingsRequest(request as any);
      };
      expect(GetBookingsRequestGetFunction).not.toThrow();
    });
  });

  test("Failing validation", () => {
    const testData = [
      {
        query: {
          id: "INVALID BOOKING ID",
        },
      },
      {
        query: {
          parkingSpotId: "INVALID PARKING SPOT ID",
        },
      },
      {
        query: {
          startDateTimeFrom: "2024-03-03T15:00:00Z",
          startDateTimeTo: "INVALID DATE",
        },
      },
      {
        query: {
          endDateTimeFrom: "2024-03-03T15:00:00Z",
          endDateTimeTo: "2024-03-03T16:00:00Z",
          page: "INVALID PAGE",
        },
      },
      {
        query: {
          parkingSpotId: 1,
          sortBy: "INVALID SORT BY",
          sortOrder: "ASC",
        },
      },
      {
        query: {
          parkingSpotId: 1,
          sortBy: "startDateTime",
          sortOrder: "INVALID SORT ORDER",
        },
      },
      {
        query: {
          page: true,
        },
      },
    ];

    testData.forEach((data) => {
      const request = { query: data.query, body: { user: standardUser } };
      const GetBookingsRequestGetFunction = () => {
        new GetBookingsRequest(request as any);
      };
      expect(GetBookingsRequestGetFunction).toThrow();
    });
  });
});

describe("Testing joi validation for UpdateBookingRequest class", () => {
  test("Passing validation", () => {
    const testData = [
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          user: standardUser,
        },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          user: standardUser,
        },
      },
      {
        body: {
          endDateTime: "2024-03-03T16:00:00Z",
          user: standardUser,
        },
      },
    ];

    testData.forEach((data) => {
      const request = { body: data.body, params: { id: 1 } };
      const UpdateBookingRequestPatchFunction = () => {
        new UpdateBookingRequest(request as any);
      };
      expect(UpdateBookingRequestPatchFunction).not.toThrow();
    });
  });

  test("Failing validation", () => {
    const testData = [
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          user: standardUser,
        },
        params: {},
      },
      {
        body: {
          user: standardUser,
        },
        params: { id: 1 },
      },
      {
        body: {
          startDateTime: "INVALID DATE",
          endDateTime: "2024-03-03T15:00:00Z",
          user: standardUser,
        },
        params: { id: 1 },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "INVALID DATE",
          user: standardUser,
        },
        params: { id: 1 },
      },
      {
        body: {
          startDateTime: "2024-03-03T15:00:00Z",
          endDateTime: "2024-03-03T16:00:00Z",
          user: standardUser,
        },
        params: { id: "INVALID BOOKING ID" },
      },
    ];

    testData.forEach((data) => {
      const request = { body: data.body, params: data.params };
      const UpdateBookingRequestPostFunction = () => {
        new UpdateBookingRequest(request as any);
      };
      expect(UpdateBookingRequestPostFunction).toThrow();
    });
  });
});

describe("Testing joi validation for DeleteBookingRequest class", () => {
  test("Passing validation", () => {
    const testData = [
      {
        params: { id: 1 },
        body: { user: standardUser },
      },
    ];

    testData.forEach((data) => {
      const request = { params: data.params, body: data.body };
      const DeleteBookingRequestDeleteFunction = () => {
        new DeleteBookingRequest(request as any);
      };
      expect(DeleteBookingRequestDeleteFunction).not.toThrow();
    });
  });

  test("Failing validation", () => {
    const testData = [
      {
        params: {},
        body: { user: standardUser },
      },
      {
        params: { id: "INVALID BOOKING ID" },
        body: { user: standardUser },
      },
      {
        params: { id: 1 },
      },
    ];

    testData.forEach((data) => {
      const request = { params: data.params, body: data.body };
      const DeleteBookingRequestDeleteFunction = () => {
        new DeleteBookingRequest(request as any);
      };
      expect(DeleteBookingRequestDeleteFunction).toThrow();
    });
  });
});
