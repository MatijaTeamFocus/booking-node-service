import { Booking } from "./entities/booking.entity";
import { DataSource } from "typeorm";
import { ParkingSpot } from "./entities/parking-spot.entity";
import { User } from "./entities/user.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "booking_db",
    synchronize: true,
    logging: true,
    useUTC: true,
    entities: [User, Booking, ParkingSpot],
    subscribers: [],
    migrations: [],
})