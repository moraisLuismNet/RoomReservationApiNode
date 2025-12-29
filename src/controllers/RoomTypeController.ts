import { Request, Response } from "express";
import { RoomTypeService } from "../services/RoomTypeService";

const roomTypeService = new RoomTypeService();

export class RoomTypeController {
  async getAll(req: Request, res: Response) {
    try {
      const roomTypes = await roomTypeService.getAllRoomTypes();
      res.json(roomTypes);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving room types", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const roomType = await roomTypeService.getRoomType(id);
      if (!roomType) {
        return res.status(404).json({ message: "Room type not found" });
      }
      res.json(roomType);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving room type", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const roomType = await roomTypeService.createRoomType(req.body);
      res.status(201).json(roomType);
    } catch (error) {
      res.status(500).json({ message: "Error creating room type", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await roomTypeService.updateRoomType(id, req.body);
      if (!success) {
        return res.status(404).json({ message: "Room type not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error updating room type", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await roomTypeService.deleteRoomType(id);
      if (!success) {
        return res.status(404).json({ message: "Room type not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting room type", error });
    }
  }
}
