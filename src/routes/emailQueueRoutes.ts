import { Router } from "express";
import { EmailQueueController } from "../controllers/EmailQueueController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();
const controller = new EmailQueueController();

router.use(authenticate, authorize(["admin"]));

/**
 * @swagger
 * /api/email-queues:
 *   get:
 *     summary: Get all queued emails
 *     tags: [EmailQueues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of queued emails
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/email-queues/{id}:
 *   get:
 *     summary: Get a queued email by ID
 *     tags: [EmailQueues]
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
 *         description: Email content
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/email-queues:
 *   post:
 *     summary: Queue a new email
 *     tags: [EmailQueues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toEmail, subject, body, emailType]
 *             properties:
 *               toEmail:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               emailType:
 *                 type: string
 *               reservationId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Email queued
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/email-queues/{id}:
 *   put:
 *     summary: Update a queued email
 *     tags: [EmailQueues]
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
 *               status:
 *                 type: string
 *               errorMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/email-queues/{id}:
 *   delete:
 *     summary: Delete a queued email
 *     tags: [EmailQueues]
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
 *         description: Email deleted
 */
router.delete("/:id", controller.delete);

export default router;
