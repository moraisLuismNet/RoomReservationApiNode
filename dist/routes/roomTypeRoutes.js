"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomTypeController_1 = require("../controllers/RoomTypeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new RoomTypeController_1.RoomTypeController();
/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Get all room types
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: List of room types
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room type details
 */
router.get("/:id", controller.getById);
// Admin only routes
/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create a new room type
 *     tags: [RoomTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomTypeName, pricePerNight, capacity]
 *             properties:
 *               roomTypeName:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Room type created
 */
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.create);
/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     summary: Update a room type
 *     tags: [RoomTypes]
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
 *               roomTypeName:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room type updated
 */
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.update);
/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     summary: Delete a room type
 *     tags: [RoomTypes]
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
 *         description: Room type deleted
 */
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.delete);
exports.default = router;
