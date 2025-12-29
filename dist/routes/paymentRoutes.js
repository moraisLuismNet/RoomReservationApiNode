"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../controllers/PaymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new PaymentController_1.PaymentController();
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
router.post("/create-checkout-session", authMiddleware_1.authenticate, controller.createCheckoutSession);
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
exports.default = router;
