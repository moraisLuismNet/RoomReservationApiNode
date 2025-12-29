"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatusService = void 0;
const data_source_1 = require("../config/data/data-source");
const ReservationStatus_1 = require("../models/ReservationStatus");
class ReservationStatusService {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(ReservationStatus_1.ReservationStatus);
    }
    async getAllReservationStatuses() {
        const statuses = await this.repository.find();
        return statuses.map((s) => ({
            statusId: s.statusId,
            name: s.name,
        }));
    }
    async getReservationStatus(statusId) {
        const status = await this.repository.findOneBy({ statusId });
        if (!status)
            return null;
        return {
            statusId: status.statusId,
            name: status.name,
        };
    }
    async createReservationStatus(dto) {
        const status = new ReservationStatus_1.ReservationStatus();
        status.name = dto.name;
        const saved = await this.repository.save(status);
        return {
            statusId: saved.statusId,
            name: saved.name,
        };
    }
    async updateReservationStatus(statusId, dto) {
        const status = await this.repository.findOneBy({ statusId });
        if (!status)
            return false;
        status.name = dto.name;
        await this.repository.save(status);
        return true;
    }
    async deleteReservationStatus(statusId) {
        const result = await this.repository.delete(statusId);
        return result.affected !== 0;
    }
}
exports.ReservationStatusService = ReservationStatusService;
