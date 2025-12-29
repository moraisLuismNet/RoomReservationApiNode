"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Reservation_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Room_1 = require("./Room");
const ReservationStatus_1 = require("./ReservationStatus");
const data_source_1 = require("../config/data/data-source");
let Reservation = Reservation_1 = class Reservation {
    /**
     * Check if a room is available for the given dates
     */
    static async isRoomAvailable(roomId, checkInDate, checkOutDate, excludeReservationId) {
        const reservationRepo = data_source_1.AppDataSource.getRepository(Reservation_1);
        const statusRepo = data_source_1.AppDataSource.getRepository(ReservationStatus_1.ReservationStatus);
        const inactiveStatuses = await statusRepo.find({
            where: {
                name: (0, typeorm_1.In)([
                    ReservationStatus_1.ReservationStatusName.CANCELLED,
                    ReservationStatus_1.ReservationStatusName.COMPLETED,
                ]),
            },
        });
        const inactiveStatusIds = inactiveStatuses.map((s) => s.statusId);
        const conflictingReservations = await reservationRepo.count({
            where: {
                roomId,
                reservationId: excludeReservationId
                    ? (0, typeorm_1.Not)(excludeReservationId)
                    : undefined,
                checkInDate: (0, typeorm_1.LessThan)(checkOutDate),
                checkOutDate: (0, typeorm_1.MoreThan)(checkInDate),
                statusId: (0, typeorm_1.Not)((0, typeorm_1.In)(inactiveStatusIds)),
            },
        });
        return conflictingReservations === 0;
    }
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "reservation_id" }),
    __metadata("design:type", Number)
], Reservation.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email" }),
    __metadata("design:type", String)
], Reservation.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "room_id" }),
    __metadata("design:type", Number)
], Reservation.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "status_id" }),
    __metadata("design:type", Number)
], Reservation.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "reservation_date", type: "timestamp" }),
    __metadata("design:type", Date)
], Reservation.prototype, "reservationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "check_in_date", type: "date" }),
    __metadata("design:type", String)
], Reservation.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "check_out_date", type: "date" }),
    __metadata("design:type", String)
], Reservation.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "number_of_guests", default: 1 }),
    __metadata("design:type", Number)
], Reservation.prototype, "numberOfGuests", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cancellation_date", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Reservation.prototype, "cancellationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cancellation_reason", type: "text", nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "email" }),
    __metadata("design:type", User_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, (room) => room.reservations),
    (0, typeorm_1.JoinColumn)({ name: "room_id" }),
    __metadata("design:type", Room_1.Room)
], Reservation.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReservationStatus_1.ReservationStatus, (status) => status.reservations),
    (0, typeorm_1.JoinColumn)({ name: "status_id" }),
    __metadata("design:type", ReservationStatus_1.ReservationStatus)
], Reservation.prototype, "status", void 0);
exports.Reservation = Reservation = Reservation_1 = __decorate([
    (0, typeorm_1.Entity)("reservations")
], Reservation);
