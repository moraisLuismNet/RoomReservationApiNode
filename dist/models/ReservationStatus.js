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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatus = exports.ReservationStatusName = void 0;
const typeorm_1 = require("typeorm");
const Reservation_1 = require("./Reservation");
var ReservationStatusName;
(function (ReservationStatusName) {
    ReservationStatusName["PENDING"] = "pending";
    ReservationStatusName["CONFIRMED"] = "confirmed";
    ReservationStatusName["CHECKED_IN"] = "checked_in";
    ReservationStatusName["CHECKED_OUT"] = "checked_out";
    ReservationStatusName["CANCELLED"] = "cancelled";
    ReservationStatusName["NO_SHOW"] = "no_show";
    ReservationStatusName["COMPLETED"] = "completed";
})(ReservationStatusName || (exports.ReservationStatusName = ReservationStatusName = {}));
let ReservationStatus = class ReservationStatus {
};
exports.ReservationStatus = ReservationStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "status_id" }),
    __metadata("design:type", Number)
], ReservationStatus.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ReservationStatusName,
        unique: true,
    }),
    __metadata("design:type", String)
], ReservationStatus.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reservation_1.Reservation, (reservation) => reservation.status),
    __metadata("design:type", Array)
], ReservationStatus.prototype, "reservations", void 0);
exports.ReservationStatus = ReservationStatus = __decorate([
    (0, typeorm_1.Entity)("reservation_statuses")
], ReservationStatus);
