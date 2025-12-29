import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";

const service = new PaymentService();

export class PaymentController {
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const result = await service.createCheckoutSession(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;
      const success = await service.confirmPayment(sessionId);
      if (success) {
        res.json({ message: "Payment confirmed successfully" });
      } else {
        res.status(400).json({ error: "Payment confirmation failed" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async webhook(req: Request, res: Response) {
    // Basic implementation, real webhooks need signature verification
    // and raw body which is complex without stripe SDK and specific middleware.
    // For now, we'll return 200 as per .NET skeleton if it fails.
    res.status(200).send();
  }
}
