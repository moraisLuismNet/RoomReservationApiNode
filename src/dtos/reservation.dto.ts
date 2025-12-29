import { UserDTO } from "./user.dto";
import { RoomDTO } from "./room.dto";

export interface ReservationDTO {
  reservationId: number;
  statusId: number;
  user?: UserDTO;
  roomId: number;
  reservationDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  numberOfGuests: number;
  cancellationDate?: Date;
  cancellationReason?: string;
  room?: RoomDTO;
}

export interface CreateReservationDTO {
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  email?: string;
}

export interface UpdateReservationDTO {
  statusId?: number;
  cancellationDate?: Date;
  cancellationReason?: string;
}
