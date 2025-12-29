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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const RoomType_1 = require("./RoomType");
const Reservation_1 = require("./Reservation");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Room.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "room_number", length: 10, unique: true }),
    __metadata("design:type", String)
], Room.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "room_type_id" }),
    __metadata("design:type", Number)
], Room.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_active", default: true }),
    __metadata("design:type", Boolean)
], Room.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "image_room", length: 255, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "imageRoom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoomType_1.RoomType, (roomType) => roomType.rooms),
    (0, typeorm_1.JoinColumn)({ name: "room_type_id" }),
    __metadata("design:type", RoomType_1.RoomType)
], Room.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reservation_1.Reservation, (reservation) => reservation.room),
    __metadata("design:type", Array)
], Room.prototype, "reservations", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)("rooms")
], Room);
