"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservationsController_1 = require("../controllers/ReservationsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new ReservationsController_1.ReservationsController();
router.use(authMiddleware_1.authenticate);
/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /api/reservations/{email}:
 *   get:
 *     summary: Get reservations by user email
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user reservations
 */
router.get("/:email", controller.getByEmail);
/**
 * @swagger
 * /api/reservations/room/{roomId}:
 *   get:
 *     summary: Get reservations by room ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of room reservations
 */
router.get("/room/:roomId", controller.getByRoom);
/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomId, checkInDate, checkOutDate, numberOfGuests]
 *             properties:
 *               roomId:
 *                 type: integer
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               numberOfGuests:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation created
 */
router.post("/", controller.create);
/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       400:
 *         description: Cancellation not allowed
 */
router.delete("/:id", controller.delete);
exports.default = router;
