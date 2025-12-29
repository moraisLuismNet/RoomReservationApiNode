import { AppDataSource } from "../config/data/data-source";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { User } from "../models/User";
import {
  ReservationStatus,
  ReservationStatusName,
} from "../models/ReservationStatus";
import { CreateReservationDTO, ReservationDTO } from "../dtos/reservation.dto";
import { RoomDTO } from "../dtos/room.dto";
import { EmailService } from "./EmailService";
import { In, LessThan, MoreThan, Not } from "typeorm";

export class ReservationService {
  private reservationRepository = AppDataSource.getRepository(Reservation);
  private userRepository = AppDataSource.getRepository(User);
  private roomRepository = AppDataSource.getRepository(Room);
  private statusRepository = AppDataSource.getRepository(ReservationStatus);
  private emailService = new EmailService();

  async getAllReservations(): Promise<ReservationDTO[]> {
    const cancelledStatus = await this.statusRepository.findOneBy({
      name: ReservationStatusName.CANCELLED,
    });

    const whereCondition: any = {};
    if (cancelledStatus) {
      whereCondition.statusId = Not(cancelledStatus.statusId);
    }

    const reservations = await this.reservationRepository.find({
      where: whereCondition,
      relations: ["user", "room", "room.roomType", "status"],
    });
    return reservations.map((r) => this.mapToDTO(r));
  }

  async getReservationsByEmail(email: string): Promise<ReservationDTO[]> {
    const cancelledStatus = await this.statusRepository.findOneBy({
      name: ReservationStatusName.CANCELLED,
    });

    const whereCondition: any = { email };
    if (cancelledStatus) {
      whereCondition.statusId = Not(cancelledStatus.statusId);
    }

    const reservations = await this.reservationRepository.find({
      where: whereCondition,
      relations: ["user", "room", "room.roomType", "status"],
    });
    return reservations.map((r) => this.mapToDTO(r));
  }

  async getReservationsByRoomId(roomId: number): Promise<ReservationDTO[]> {
    const cancelledStatus = await this.statusRepository.findOneBy({
      name: ReservationStatusName.CANCELLED,
    });

    const whereCondition: any = { roomId };
    if (cancelledStatus) {
      whereCondition.statusId = Not(cancelledStatus.statusId);
    }

    const reservations = await this.reservationRepository.find({
      where: whereCondition,
      relations: ["user", "room", "room.roomType", "status"],
    });
    return reservations.map((r) => this.mapToDTO(r));
  }

  async getReservation(reservationId: number): Promise<ReservationDTO | null> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ["user", "room", "room.roomType", "status"],
    });
    return reservation ? this.mapToDTO(reservation) : null;
  }

  async createReservation(
    dto: CreateReservationDTO,
    userEmail: string
  ): Promise<ReservationDTO | string> {
    const isAvailable = await Reservation.isRoomAvailable(
      dto.roomId,
      this.formatDate(dto.checkInDate),
      this.formatDate(dto.checkOutDate)
    );

    if (!isAvailable) {
      return "The room is not available for the selected dates.";
    }

    const user = await this.userRepository.findOneBy({ email: userEmail });
    if (!user) return "User not found";

    const room = await this.roomRepository.findOneBy({ roomId: dto.roomId });
    if (!room) return "Room not found";

    const status = await this.statusRepository.findOneBy({
      name: ReservationStatusName.PENDING,
    });
    if (!status) return "Status 'pending' not found";

    const reservation = new Reservation();
    reservation.roomId = dto.roomId;
    reservation.email = user.email;
    reservation.statusId = status.statusId;
    reservation.reservationDate = new Date();
    reservation.checkInDate = this.formatDate(dto.checkInDate);
    reservation.checkOutDate = this.formatDate(dto.checkOutDate);
    reservation.numberOfGuests = dto.numberOfGuests;

    // Calculate number of nights
    const diffTime = Math.abs(
      new Date(dto.checkOutDate).getTime() - new Date(dto.checkInDate).getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // We could calculate totalAmount here if needed
    // reservation.totalAmount = diffDays * Number(room.roomType.basePrice);

    const savedReservation = await this.reservationRepository.save(reservation);

    // Fetch with relations
    const fullReservation = await this.getReservation(
      savedReservation.reservationId
    );
    return fullReservation!;
  }

  async deleteReservation(reservationId: number): Promise<boolean | string> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ["user"],
    });

    if (!reservation) return "Reservation not found";

    // Check if can be cancelled (not cancelled=5 or checked-in=3)
    if (reservation.statusId === 5 || reservation.statusId === 3) {
      return "The reservation cannot be cancelled because it is already cancelled or check-in has already taken place.";
    }

    const checkIn = new Date(reservation.checkInDate);
    const now = new Date();
    const diffHours = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return "The reservation can only be cancelled at least 24 hours before check-in.";
    }

    // Send email
    const emailSubject = "Reservation Cancellation Confirmation";
    const emailBody = `
      <h1>Reservation Cancellation Confirmation</h1>
      <p>Dear ${reservation.user.fullName || "Customer"},</p>
      <p>Your reservation has been successfully cancelled.</p>
      <p><strong>Reservation details:</strong></p>
      <ul>
          <li>Entry date: ${reservation.checkInDate}</li>
          <li>Departure date: ${reservation.checkOutDate}</li>
      </ul>
      <p>If you have any questions or need further assistance, please contact us.</p>
    `;

    await this.emailService.sendEmailAsync(
      reservation.user.email,
      emailSubject,
      emailBody,
      "cancellation",
      reservation.reservationId
    );

    const cancelledStatus = await this.statusRepository.findOneBy({
      name: ReservationStatusName.CANCELLED,
    });
    if (!cancelledStatus) return "Status 'cancelled' not found";

    reservation.statusId = cancelledStatus.statusId; // Cancelled
    reservation.cancellationDate = new Date();
    reservation.cancellationReason = "Cancelled by user";

    await this.reservationRepository.save(reservation);
    return true;
  }

  private mapToDTO(r: Reservation): ReservationDTO {
    const checkIn = new Date(r.checkInDate);
    const checkOut = new Date(r.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      reservationId: r.reservationId,
      statusId: r.statusId,
      roomId: r.roomId,
      reservationDate: r.reservationDate,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfNights: diffDays,
      numberOfGuests: r.numberOfGuests,
      user: r.user
        ? {
            email: r.user.email,
            fullName: r.user.fullName,
            phoneNumber: r.user.phoneNumber,
            isActive: r.user.isActive,
            createdAt: r.user.createdAt,
            role: r.user.role,
          }
        : ({ email: r.email } as any),
      cancellationDate: r.cancellationDate,
      cancellationReason: r.cancellationReason,
      room: r.room
        ? ({
            roomId: r.room.roomId,
            roomNumber: r.room.roomNumber,
            roomTypeId: r.room.roomTypeId,
            pricePerNight: Number(r.room.roomType?.pricePerNight || 0),
            capacity: r.room.roomType?.capacity || 0,
            isActive: r.room.isActive,
            imageRoom: r.room.imageRoom,
            roomTypeName: r.room.roomType?.roomTypeName,
            description: r.room.roomType?.description,
          } as RoomDTO)
        : undefined,
    };
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }
}
