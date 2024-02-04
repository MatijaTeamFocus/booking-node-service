import { Booking } from "./entities/booking.entity";
import { DataSource } from "typeorm";
import { ParkingSpot } from "./entities/parking-spot.entity";
import { User } from "./entities/user.entity";

require('dotenv').config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "postgres",
  database: process.env.POSTGRES_DB ?? "booking_db",
  synchronize: process.env.NODE_ENV === "local" ? true : false,
  logging: process.env.NODE_ENV === "local" ? true : false,
  useUTC: true,
  entities: [User, Booking, ParkingSpot],
  subscribers: [],
  migrations: [],
});
