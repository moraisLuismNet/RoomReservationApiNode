"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = require("../controllers/RoomController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new RoomController_1.RoomController();
/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */
router.get("/:id", controller.getById);
// Admin only routes
/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomNumber, roomTypeId]
 *             properties:
 *               roomNumber:
 *                 type: string
 *               roomTypeId:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               imageRoom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created
 */
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.create);
/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
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
 *               roomNumber:
 *                 type: string
 *               roomTypeId:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               imageRoom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated
 */
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.update);
/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
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
 *         description: Room deleted
 */
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), controller.delete);
exports.default = router;
