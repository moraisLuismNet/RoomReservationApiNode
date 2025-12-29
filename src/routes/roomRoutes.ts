import { Router } from "express";
import { RoomController } from "../controllers/RoomController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();
const controller = new RoomController();

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
router.post("/", authenticate, authorize(["admin"]), controller.create);

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
router.put("/:id", authenticate, authorize(["admin"]), controller.update);

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
router.delete("/:id", authenticate, authorize(["admin"]), controller.delete);

export default router;
