import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ParkingSpot } from "./parking-spot.entity";
import { User } from "./user.entity";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by_user_id" })
  createdByUser: User;

  @Column({ name: "created_by_user_id", type: "number" })
  createdByUserId: number;

  @Column({
    name: "start_date_time",
    type: "timestamp with time zone",
    nullable: false,
  })
  startDateTime: Date;

  @Column({
    name: "end_date_time",
    type: "timestamp with time zone",
    nullable: false,
  })
  endDateTime: Date;

  @ManyToOne(() => ParkingSpot)
  @JoinColumn({ name: "parking_spot_id" })
  parkingSpot: ParkingSpot;

  @Column({ name: "parking_spot_id", type: "number" })
  parkingSpotId: number;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
    type: "timestamp",
  })
  createdAt: Date;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    name: "updated_at",
    type: "timestamp",
  })
  updatedAt: Date;
}
