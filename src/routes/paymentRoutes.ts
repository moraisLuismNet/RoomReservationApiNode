import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const controller = new PaymentController();

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservationId]
 *             properties:
 *               reservationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Session created
 */
router.post(
  "/create-checkout-session",
  authenticate,
  controller.createCheckoutSession
);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post("/confirm", controller.confirmPayment);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post("/webhook", controller.webhook);

export default router;
