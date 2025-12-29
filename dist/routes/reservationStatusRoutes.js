"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservationStatusController_1 = require("../controllers/ReservationStatusController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new ReservationStatusController_1.ReservationStatusController();
// All routes are admin only in .NET version
router.use(authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]));
/**
 * @swagger
 * /api/reservation-statuses:
 *   get:
 *     summary: Get all reservation statuses
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservation statuses
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   get:
 *     summary: Get reservation status by ID
 *     tags: [ReservationStatuses]
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
 *         description: Reservation status found
 */
router.get("/:id", controller.getById);
/**
 * @swagger
 * /api/reservation-statuses:
 *   post:
 *     summary: Create a new reservation status
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status created
 */
router.post("/", controller.create);
/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   put:
 *     summary: Update a reservation status
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/:id", controller.update);
/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   delete:
 *     summary: Delete a reservation status
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Status deleted
 */
router.delete("/:id", controller.delete);
exports.default = router;
