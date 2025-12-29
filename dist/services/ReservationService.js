"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const data_source_1 = require("../config/data/data-source");
const Reservation_1 = require("../models/Reservation");
const Room_1 = require("../models/Room");
const User_1 = require("../models/User");
const ReservationStatus_1 = require("../models/ReservationStatus");
const EmailService_1 = require("./EmailService");
class ReservationService {
    constructor() {
        this.reservationRepository = data_source_1.AppDataSource.getRepository(Reservation_1.Reservation);
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        this.statusRepository = data_source_1.AppDataSource.getRepository(ReservationStatus_1.ReservationStatus);
        this.emailService = new EmailService_1.EmailService();
    }
    async getAllReservations() {
        const reservations = await this.reservationRepository.find({
            relations: ["user", "room", "status"],
        });
        return reservations.map((r) => this.mapToDTO(r));
    }
    async getReservationsByEmail(email) {
        const reservations = await this.reservationRepository.find({
            where: { user: { email } },
            relations: ["user", "room", "status"],
        });
        return reservations.map((r) => this.mapToDTO(r));
    }
    async getReservationsByRoomId(roomId) {
        const reservations = await this.reservationRepository.find({
            where: { roomId },
            relations: ["user", "room", "status"],
        });
        return reservations.map((r) => this.mapToDTO(r));
    }
    async getReservation(reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservationId },
            relations: ["user", "room", "status"],
        });
        return reservation ? this.mapToDTO(reservation) : null;
    }
    async createReservation(dto, userEmail) {
        const isAvailable = await Reservation_1.Reservation.isRoomAvailable(dto.roomId, this.formatDate(dto.checkInDate), this.formatDate(dto.checkOutDate));
        if (!isAvailable) {
            return "The room is not available for the selected dates.";
        }
        const user = await this.userRepository.findOneBy({ email: userEmail });
        if (!user)
            return "User not found";
        const room = await this.roomRepository.findOneBy({ roomId: dto.roomId });
        if (!room)
            return "Room not found";
        const status = await this.statusRepository.findOneBy({ statusId: 1 }); // 1 = pending as per .NET
        if (!status)
            return "Status 'pending' not found";
        const reservation = new Reservation_1.Reservation();
        reservation.roomId = dto.roomId;
        reservation.email = user.email;
        reservation.statusId = status.statusId;
        reservation.reservationDate = new Date();
        reservation.checkInDate = this.formatDate(dto.checkInDate);
        reservation.checkOutDate = this.formatDate(dto.checkOutDate);
        reservation.numberOfGuests = dto.numberOfGuests;
        // Calculate number of nights
        const diffTime = Math.abs(new Date(dto.checkOutDate).getTime() - new Date(dto.checkInDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // We could calculate totalAmount here if needed
        // reservation.totalAmount = diffDays * Number(room.roomType.basePrice);
        const savedReservation = await this.reservationRepository.save(reservation);
        // Fetch with relations
        const fullReservation = await this.getReservation(savedReservation.reservationId);
        return fullReservation;
    }
    async deleteReservation(reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservationId },
            relations: ["user"],
        });
        if (!reservation)
            return "Reservation not found";
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
        await this.emailService.sendEmailAsync(reservation.user.email, emailSubject, emailBody, "cancellation", reservation.reservationId);
        reservation.statusId = 5; // Cancelled
        reservation.cancellationDate = new Date();
        reservation.cancellationReason = "Cancelled by user";
        await this.reservationRepository.save(reservation);
        return true;
    }
    mapToDTO(r) {
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
            user: {
                email: r.user.email,
                fullName: r.user.fullName,
                phoneNumber: r.user.phoneNumber,
                isActive: r.user.isActive,
                createdAt: r.user.createdAt,
                role: r.user.role,
            },
            cancellationDate: r.cancellationDate,
            cancellationReason: r.cancellationReason,
        };
    }
    formatDate(date) {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    }
}
exports.ReservationService = ReservationService;
