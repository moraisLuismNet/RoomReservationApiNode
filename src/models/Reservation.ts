import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  LessThan,
  MoreThan,
  Not,
  In,
} from "typeorm";
import { User } from "./User";
import { Room } from "./Room";
import { ReservationStatus, ReservationStatusName } from "./ReservationStatus";
import { AppDataSource } from "../config/data/data-source";

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn({ name: "reservation_id" })
  reservationId!: number;

  @Column({ name: "email" })
  email!: string;

  @Column({ name: "room_id" })
  roomId!: number;

  @Column({ name: "status_id" })
  statusId!: number;

  @Column({ name: "reservation_date", type: "timestamp" })
  reservationDate!: Date;

  @Column({ name: "check_in_date", type: "date" })
  checkInDate!: string; // YYYY-MM-DD

  @Column({ name: "check_out_date", type: "date" })
  checkOutDate!: string; // YYYY-MM-DD

  @Column({ name: "number_of_guests", default: 1 })
  numberOfGuests!: number;

  @Column({ name: "cancellation_date", type: "timestamp", nullable: true })
  cancellationDate?: Date;

  @Column({ name: "cancellation_reason", type: "text", nullable: true })
  cancellationReason?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "email" })
  user!: User;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: "room_id" })
  room!: Room;

  @ManyToOne(() => ReservationStatus, (status) => status.reservations)
  @JoinColumn({ name: "status_id" })
  status!: ReservationStatus;

  /**
   * Check if a room is available for the given dates
   */
  static async isRoomAvailable(
    roomId: number,
    checkInDate: string,
    checkOutDate: string,
    excludeReservationId?: number
  ): Promise<boolean> {
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const statusRepo = AppDataSource.getRepository(ReservationStatus);

    const inactiveStatuses = await statusRepo.find({
      where: {
        name: In([
          ReservationStatusName.CANCELLED,
          ReservationStatusName.COMPLETED,
        ]),
      },
    });
    const inactiveStatusIds = inactiveStatuses.map((s) => s.statusId);

    const conflictingReservations = await reservationRepo.count({
      where: {
        roomId,
        reservationId: excludeReservationId
          ? Not(excludeReservationId)
          : undefined,
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
        statusId: Not(In(inactiveStatusIds)),
      },
    });

    return conflictingReservations === 0;
  }
}
