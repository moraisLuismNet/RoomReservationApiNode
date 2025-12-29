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
exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const Room_1 = require("./Room");
let RoomType = class RoomType {
};
exports.RoomType = RoomType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoomType.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "room_type_name", length: 50, unique: true }),
    __metadata("design:type", String)
], RoomType.prototype, "roomTypeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], RoomType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "price_per_night", type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RoomType.prototype, "pricePerNight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "capacity", type: "integer" }),
    __metadata("design:type", Number)
], RoomType.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "rooms", void 0);
exports.RoomType = RoomType = __decorate([
    (0, typeorm_1.Entity)("room_types")
], RoomType);
