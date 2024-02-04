import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  Admin = "Admin",
  Standard = "Standard",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", type: "varchar" })
  firstName: string;

  @Column({ name: "last_name", type: "varchar" })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.Standard, // Default role is Standard
  })
  role: UserRole;

  @Column({ type: "varchar" })
  token: string;
}
