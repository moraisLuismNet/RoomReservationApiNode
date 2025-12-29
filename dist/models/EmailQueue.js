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
exports.EmailQueue = void 0;
const typeorm_1 = require("typeorm");
const Reservation_1 = require("./Reservation");
let EmailQueue = class EmailQueue {
};
exports.EmailQueue = EmailQueue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "email_queue_id" }),
    __metadata("design:type", Number)
], EmailQueue.prototype, "emailQueueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], EmailQueue.prototype, "toEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], EmailQueue.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], EmailQueue.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], EmailQueue.prototype, "emailType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: "pending" }),
    __metadata("design:type", String)
], EmailQueue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], EmailQueue.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 3 }),
    __metadata("design:type", Number)
], EmailQueue.prototype, "maxAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], EmailQueue.prototype, "scheduledSendTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], EmailQueue.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, default: "" }),
    __metadata("design:type", String)
], EmailQueue.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], EmailQueue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "reservation_id", nullable: true }),
    __metadata("design:type", Number)
], EmailQueue.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Reservation_1.Reservation),
    (0, typeorm_1.JoinColumn)({ name: "reservation_id" }),
    __metadata("design:type", Reservation_1.Reservation)
], EmailQueue.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], EmailQueue.prototype, "metadata", void 0);
exports.EmailQueue = EmailQueue = __decorate([
    (0, typeorm_1.Entity)("email_queues")
], EmailQueue);
