import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { RoomType } from "./RoomType";
import { Reservation } from "./Reservation";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  roomId!: number;

  @Column({ name: "room_number", length: 10, unique: true })
  roomNumber!: string;

  @Column({ name: "room_type_id" })
  roomTypeId!: number;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "image_room", length: 2048, nullable: true })
  imageRoom?: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn({ name: "room_type_id" })
  roomType!: RoomType;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations!: Reservation[];
}
