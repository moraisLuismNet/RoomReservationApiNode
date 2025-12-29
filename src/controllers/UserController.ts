import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const service = new UserService();

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await service.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const user = await service.getUser(req.params.email);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await service.putUser(req.params.email, req.body);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await service.deleteUser(req.params.email);
      if (!success) return res.status(404).json({ message: "User not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }
}
