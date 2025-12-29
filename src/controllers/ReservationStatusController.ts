import { Request, Response } from "express";
import { ReservationStatusService } from "../services/ReservationStatusService";

const service = new ReservationStatusService();

export class ReservationStatusController {
  async getAll(req: Request, res: Response) {
    try {
      const statuses = await service.getAllReservationStatuses();
      res.json(statuses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving reservation statuses", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const status = await service.getReservationStatus(id);
      if (!status) {
        return res
          .status(404)
          .json({ message: "Reservation status not found" });
      }
      res.json(status);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving reservation status", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const status = await service.createReservationStatus(req.body);
      res.status(201).json(status);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating reservation status", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await service.updateReservationStatus(id, req.body);
      if (!success) {
        return res
          .status(404)
          .json({ message: "Reservation status not found" });
      }
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating reservation status", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await service.deleteReservationStatus(id);
      if (!success) {
        return res
          .status(404)
          .json({ message: "Reservation status not found" });
      }
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting reservation status", error });
    }
  }
}
