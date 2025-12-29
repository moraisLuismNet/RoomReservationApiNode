import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Reservation } from "./Reservation";

export enum ReservationStatusName {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
  COMPLETED = "completed",
}

@Entity("reservation_statuses")
export class ReservationStatus {
  @PrimaryGeneratedColumn({ name: "status_id" })
  statusId!: number;

  @Column({
    type: "enum",
    enum: ReservationStatusName,
    unique: true,
  })
  name!: ReservationStatusName;

  @OneToMany(() => Reservation, (reservation) => reservation.status)
  reservations!: Reservation[];
}
