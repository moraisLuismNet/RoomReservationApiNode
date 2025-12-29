"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypeController = void 0;
const RoomTypeService_1 = require("../services/RoomTypeService");
const roomTypeService = new RoomTypeService_1.RoomTypeService();
class RoomTypeController {
    async getAll(req, res) {
        try {
            const roomTypes = await roomTypeService.getAllRoomTypes();
            res.json(roomTypes);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving room types", error });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const roomType = await roomTypeService.getRoomType(id);
            if (!roomType) {
                return res.status(404).json({ message: "Room type not found" });
            }
            res.json(roomType);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving room type", error });
        }
    }
    async create(req, res) {
        try {
            const roomType = await roomTypeService.createRoomType(req.body);
            res.status(201).json(roomType);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating room type", error });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await roomTypeService.updateRoomType(id, req.body);
            if (!success) {
                return res.status(404).json({ message: "Room type not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error updating room type", error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await roomTypeService.deleteRoomType(id);
            if (!success) {
                return res.status(404).json({ message: "Room type not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting room type", error });
        }
    }
}
exports.RoomTypeController = RoomTypeController;
