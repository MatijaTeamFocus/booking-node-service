import { AppDataSource } from "../data-source";
import fs from "fs";

export class BookingDbPostgresHelper {
    public async insertBookings(): Promise<void> {
        // insert bookings
        await AppDataSource.query(this.readSqlFile('src/tests/data/booking.sql'));
    }
    public async insertParkingSpots(): Promise<void> {
        // insert parking spots
        await AppDataSource.query(this.readSqlFile('src/tests/data/parking_spot.sql'));
    }
    public async insertUsers(): Promise<void> {
        // insert users
        await AppDataSource.query(this.readSqlFile('src/tests/data/user.sql'));
    }

    public async cleanTables() {
        await AppDataSource.query("DELETE FROM booking");
        await AppDataSource.query("DELETE FROM parking_spot");
        await AppDataSource.query("DELETE FROM public.user");
    }

    private readSqlFile(fileLocation: string) {
        const fileRaw = fs.readFileSync(fileLocation);
        const fileRawString = fileRaw.toString();
        return fileRawString;
    }
}