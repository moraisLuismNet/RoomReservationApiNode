import { Request, Response } from "express";
import { RoomService } from "../services/RoomService";

const roomService = new RoomService();

export class RoomController {
  async getAll(req: Request, res: Response) {
    try {
      const rooms = await roomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      console.error("[RoomController] Error retrieving rooms:", error);
      res.status(500).json({ message: "Error retrieving rooms", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const room = await roomService.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("[RoomController] Error retrieving room:", error);
      res.status(500).json({ message: "Error retrieving room", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const room = await roomService.createRoom(req.body);
      if (!room) {
        return res.status(400).json({ message: "Invalid room type" });
      }
      res.status(201).json(room);
    } catch (error) {
      console.error("[RoomController] Error creating room:", error);
      res.status(500).json({ message: "Error creating room", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const room = await roomService.updateRoom(id, req.body);
      if (!room) {
        return res
          .status(404)
          .json({ message: "Room not found or invalid room type" });
      }
      res.json(room);
    } catch (error) {
      console.error("[RoomController] Error updating room:", error);
      res.status(500).json({ message: "Error updating room", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await roomService.deleteRoom(id);
      if (!success) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting room", error });
    }
  }
}
