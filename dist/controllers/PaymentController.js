"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const PaymentService_1 = require("../services/PaymentService");
const service = new PaymentService_1.PaymentService();
class PaymentController {
    async createCheckoutSession(req, res) {
        try {
            const result = await service.createCheckoutSession(req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async confirmPayment(req, res) {
        try {
            const { sessionId } = req.body;
            const success = await service.confirmPayment(sessionId);
            if (success) {
                res.json({ message: "Payment confirmed successfully" });
            }
            else {
                res.status(400).json({ error: "Payment confirmation failed" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async webhook(req, res) {
        // Basic implementation, real webhooks need signature verification
        // and raw body which is complex without stripe SDK and specific middleware.
        // For now, we'll return 200 as per .NET skeleton if it fails.
        res.status(200).send();
    }
}
exports.PaymentController = PaymentController;
