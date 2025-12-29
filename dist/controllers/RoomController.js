"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const RoomService_1 = require("../services/RoomService");
const roomService = new RoomService_1.RoomService();
class RoomController {
    async getAll(req, res) {
        try {
            const rooms = await roomService.getAllRooms();
            res.json(rooms);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving rooms", error });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const room = await roomService.getRoom(id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.json(room);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving room", error });
        }
    }
    async create(req, res) {
        try {
            const room = await roomService.createRoom(req.body);
            if (!room) {
                return res.status(400).json({ message: "Invalid room type" });
            }
            res.status(201).json(room);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating room", error });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const room = await roomService.updateRoom(id, req.body);
            if (!room) {
                return res
                    .status(404)
                    .json({ message: "Room not found or invalid room type" });
            }
            res.json(room);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating room", error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await roomService.deleteRoom(id);
            if (!success) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting room", error });
        }
    }
}
exports.RoomController = RoomController;
