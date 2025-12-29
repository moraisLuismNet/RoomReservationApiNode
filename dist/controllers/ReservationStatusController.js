"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatusController = void 0;
const ReservationStatusService_1 = require("../services/ReservationStatusService");
const service = new ReservationStatusService_1.ReservationStatusService();
class ReservationStatusController {
    async getAll(req, res) {
        try {
            const statuses = await service.getAllReservationStatuses();
            res.json(statuses);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error retrieving reservation statuses", error });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const status = await service.getReservationStatus(id);
            if (!status) {
                return res
                    .status(404)
                    .json({ message: "Reservation status not found" });
            }
            res.json(status);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error retrieving reservation status", error });
        }
    }
    async create(req, res) {
        try {
            const status = await service.createReservationStatus(req.body);
            res.status(201).json(status);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error creating reservation status", error });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await service.updateReservationStatus(id, req.body);
            if (!success) {
                return res
                    .status(404)
                    .json({ message: "Reservation status not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error updating reservation status", error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await service.deleteReservationStatus(id);
            if (!success) {
                return res
                    .status(404)
                    .json({ message: "Reservation status not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error deleting reservation status", error });
        }
    }
}
exports.ReservationStatusController = ReservationStatusController;
