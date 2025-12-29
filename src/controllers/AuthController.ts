import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      if (!result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error during login", error });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error during registration", error });
    }
  }
}
