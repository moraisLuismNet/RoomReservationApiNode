import { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";

const service = new ReservationService();

export class ReservationsController {
  async getAll(req: Request, res: Response) {
    try {
      if ((req as any).user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const reservations = await service.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving reservations", error });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const user = (req as any).user;

      if (user.role !== "admin" && user.email !== email) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const reservations = await service.getReservationsByEmail(email);
      res.json(reservations || []);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving reservations", error });
    }
  }

  async getByRoom(req: Request, res: Response) {
    try {
      const roomId = parseInt(req.params.roomId);
      const reservations = await service.getReservationsByRoomId(roomId);
      res.json(reservations);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving reservations by room", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userEmail = (req as any).user.email;
      const result = await service.createReservation(req.body, userEmail);

      if (typeof result === "string") {
        return res.status(400).json({ message: result });
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error creating reservation", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await service.deleteReservation(id);

      if (typeof result === "string") {
        return res.status(400).json({ message: result });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error cancelling reservation", error });
    }
  }
}
