import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Room } from "./Room";

@Entity("room_types")
export class RoomType {
  @PrimaryGeneratedColumn()
  roomTypeId!: number;

  @Column({ name: "room_type_name", length: 50, unique: true })
  roomTypeName!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "price_per_night", type: "decimal", precision: 10, scale: 2 })
  pricePerNight!: number;

  @Column({ name: "capacity", type: "integer" })
  capacity!: number;

  @OneToMany(() => Room, (room) => room.roomType)
  rooms!: Room[];
}
