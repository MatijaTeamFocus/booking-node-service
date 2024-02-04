import { describe, expect, test } from "@jest/globals";

import { AppDataSource } from "../../data-source";
import { BookingDbPostgresHelper } from "../../utils/postgres-test.util";
import { WebServer } from "../../WebServer";
import express from "express";
import request from "supertest";

let webServer: WebServer;
let app: express.Express;
let bookingDbPostgresHelper: BookingDbPostgresHelper;

describe("Testing /bookings routes", () => {
  beforeAll(async () => {
    bookingDbPostgresHelper = new BookingDbPostgresHelper();
    webServer = new WebServer(3000);
    app = webServer.getApp();
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await webServer.shutdown();
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await bookingDbPostgresHelper.insertParkingSpots();
    await bookingDbPostgresHelper.insertUsers();
    await bookingDbPostgresHelper.insertBookings();
  });

  afterEach(async () => {
    await bookingDbPostgresHelper.cleanTables();
  });

  describe("Testing POST /bookings", () => {
    test("Create booking - Happy case", async () => {
      const response = await request(app)
        .post("/bookings")
        .set("api-token", "standard-token")
        .send({
          parkingSpotId: 1,
          startDateTime: "2024-04-04T10:00:00.000Z",
          endDateTime: "2024-04-04T11:10:00.000Z",
        });
      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.startDateTime).toBe("2024-04-04T10:00:00.000Z");
      expect(response.body.endDateTime).toBe("2024-04-04T11:10:00.000Z");
    });

    test("Create booking - Missing parking spot", async () => {
      const response = await request(app)
        .post("/bookings")
        .set("api-token", "standard-token")
        .send({
          parkingSpotId: 4,
          startDateTime: "2024-03-03T15:00:00.000Z",
          endDateTime: "2024-03-03T16:10:00.000Z",
        });
      expect(response).toBeDefined();
      expect(response.body.message).toBe("Parking spot not found");
      expect(response.statusCode).toBe(404);
    });

    test("Create booking - Existing booking", async () => {
      const response = await request(app)
        .post("/bookings")
        .set("api-token", "standard-token")
        .send({
          parkingSpotId: 1,
          startDateTime: "2024-03-03T16:30:00.000Z",
          endDateTime: "2024-03-03T17:30:00.000Z",
        });
      expect(response).toBeDefined();
      expect(response.body.message).toBe("Bad request.");
      expect(response.body.details.message).toBe(
        "Booking conflicts with existing booking"
      );
      expect(response.body.details.existentBooking).toBeDefined();
      expect(response.body.details.existentBooking.startDateTime).toBe(
        "2024-03-03T16:50:00.000Z"
      );
      expect(response.body.details.existentBooking.endDateTime).toBe(
        "2024-03-03T17:50:00.000Z"
      );
      expect(response.statusCode).toBe(400);
    });
  });

  describe("Testing GET /bookings", () => {
    test("Get bookings - Happy case - Standard user - his booking", async () => {
      const getBookingsUrl = `/bookings?id=1000`;
      const response = await request(app)
        .get(getBookingsUrl)
        .set("api-token", "standard-token");

      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.bookings.length).toBe(1);
      expect(response.body.bookings[0].id).toBe(1000);
      expect(response.body.bookings[0].createdByUserId).toBe(1);
      expect(response.body.bookings[0].parkingSpotId).toBe(1);
    });

    test("Get bookings - Happy case - Admin user - parking spots bookings", async () => {
      const getBookingsUrl = `/bookings?parkingSpotId=1`;
      const response = await request(app)
        .get(getBookingsUrl)
        .set("api-token", "admin-token");

      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.bookings.length).toBe(2);
      expect(response.body.bookings[0].id).toBe(1000);
      expect(response.body.bookings[0].createdByUserId).toBe(1);
      expect(response.body.bookings[0].parkingSpotId).toBe(1);
      expect(response.body.bookings[1].id).toBe(1001);
      expect(response.body.bookings[1].createdByUserId).toBe(2);
      expect(response.body.bookings[1].parkingSpotId).toBe(1);
    });

    test("Get bookings - Happy case - Standard user - parking spots bookings", async () => {
      const getBookingsUrl = `/bookings?parkingSpotId=1`;
      const response = await request(app)
        .get(getBookingsUrl)
        .set("api-token", "standard-token");

      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.bookings.length).toBe(1);
      expect(response.body.bookings[0].id).toBe(1000);
      expect(response.body.bookings[0].createdByUserId).toBe(1);
      expect(response.body.bookings[0].parkingSpotId).toBe(1);
    });

    test("Get bookings - Happy case - Standard user - no bookings found", async () => {
      const getBookingsUrl = `/bookings?id=5`;
      const response = await request(app)
        .get(getBookingsUrl)
        .set("api-token", "standard-token");

      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.bookings.length).toBe(0);
    });
  });

  describe("Testing PATCH /bookings", () => {
    test("Update booking - Happy case - Standard user - his booking", async () => {
      const response = await request(app)
        .patch("/bookings/1000")
        .set("api-token", "standard-token")
        .send({
          startDateTime: "2024-04-04T10:00:00.000Z",
          endDateTime: "2024-04-04T11:10:00.000Z",
        });

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(1000);
      expect(response.body.startDateTime).toBe("2024-04-04T10:00:00.000Z");
      expect(response.body.endDateTime).toBe("2024-04-04T11:10:00.000Z");
    });

    test("Update booking - Happy case - Admin user - not his booking", async () => {
      const response = await request(app)
        .patch("/bookings/1000")
        .set("api-token", "standard-token")
        .send({
          startDateTime: "2024-05-05T10:00:00.000Z",
          endDateTime: "2024-05-05T11:10:00.000Z",
        });

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(1000);
      expect(response.body.startDateTime).toBe("2024-05-05T10:00:00.000Z");
      expect(response.body.endDateTime).toBe("2024-05-05T11:10:00.000Z");
    });

    test("Update booking - Missing booking", async () => {
      const response = await request(app)
        .patch("/bookings/1005")
        .set("api-token", "standard-token")
        .send({
          startDateTime: "2024-04-04T10:00:00.000Z",
          endDateTime: "2024-04-04T11:10:00.000Z",
        });

      expect(response).toBeDefined();
      expect(response.body.message).toBe("Booking not found");
      expect(response.statusCode).toBe(404);
    });

    test("Update booking - Existing booking", async () => {
      const response = await request(app)
        .patch("/bookings/1002")
        .set("api-token", "standard-token")
        .send({
          startDateTime: "2024-03-03T09:30:00.000Z",
          endDateTime: "2024-03-03T10:30:00.000Z",
        });

      expect(response).toBeDefined();
      expect(response.body.message).toBe("Bad request.");
      expect(response.body.details.message).toBe(
        "Booking conflicts with existing booking"
      );
      expect(response.body.details.existentBooking).toBeDefined();
      expect(response.body.details.existentBooking.startDateTime).toBe(
        "2024-03-03T10:00:00.000Z"
      );
      expect(response.body.details.existentBooking.endDateTime).toBe(
        "2024-03-03T11:00:00.000Z"
      );
      expect(response.statusCode).toBe(400);
    });

    test("Update booking - Start date time cannot be greater than end date time", async () => {
      const response = await request(app)
        .patch("/bookings/1003")
        .set("api-token", "standard-token")
        .send({
          startDateTime: "2024-04-04T11:10:00.000Z",
        });

      expect(response).toBeDefined();
      expect(response.body.message).toBe(
        "Start date time cannot be greater than end date time"
      );
      expect(response.statusCode).toBe(400);
    });
  });

  describe("Testing DELETE /bookings", () => {
    test("Delete booking - Happy case - Standard user - his booking", async () => {
      const response = await request(app)
        .delete("/bookings/1000")
        .set("api-token", "standard-token");

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.message).toBe("Booking deleted successfully");
    });

    test("Delete booking - Happy case - Admin user - not his booking", async () => {
      const response = await request(app)
        .delete("/bookings/1002")
        .set("api-token", "admin-token");

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.message).toBe("Booking deleted successfully");
    });

    test("Delete booking - Missing booking", async () => {
      const response = await request(app)
        .delete("/bookings/1005")
        .set("api-token", "standard-token");

      expect(response).toBeDefined();
      expect(response.body.message).toBe("Booking not found");
      expect(response.statusCode).toBe(404);
    });
  });
});
