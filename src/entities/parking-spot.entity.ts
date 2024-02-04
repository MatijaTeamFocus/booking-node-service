import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ParkingSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;
}
