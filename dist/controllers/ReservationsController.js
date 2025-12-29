"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsController = void 0;
const ReservationService_1 = require("../services/ReservationService");
const service = new ReservationService_1.ReservationService();
class ReservationsController {
    async getAll(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Forbidden" });
            }
            const reservations = await service.getAllReservations();
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving reservations", error });
        }
    }
    async getByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = req.user;
            if (user.role !== "admin" && user.email !== email) {
                return res.status(403).json({ message: "Forbidden" });
            }
            const reservations = await service.getReservationsByEmail(email);
            if (!reservations || reservations.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No reservations found for this email" });
            }
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving reservations", error });
        }
    }
    async getByRoom(req, res) {
        try {
            const roomId = parseInt(req.params.roomId);
            const reservations = await service.getReservationsByRoomId(roomId);
            res.json(reservations);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error retrieving reservations by room", error });
        }
    }
    async create(req, res) {
        try {
            const userEmail = req.user.email;
            const result = await service.createReservation(req.body, userEmail);
            if (typeof result === "string") {
                return res.status(400).json({ message: result });
            }
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating reservation", error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await service.deleteReservation(id);
            if (typeof result === "string") {
                return res.status(400).json({ message: result });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error cancelling reservation", error });
        }
    }
}
exports.ReservationsController = ReservationsController;
