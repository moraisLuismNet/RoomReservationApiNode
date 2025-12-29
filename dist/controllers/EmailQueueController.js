"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueController = void 0;
const EmailQueueService_1 = require("../services/EmailQueueService");
const service = new EmailQueueService_1.EmailQueueService();
class EmailQueueController {
    async getAll(req, res) {
        try {
            const items = await service.getAllEmailQueues();
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving email queues", error });
        }
    }
    async getById(req, res) {
        try {
            const item = await service.getEmailQueue(parseInt(req.params.id));
            if (!item)
                return res.status(404).json({ message: "Email queue not found" });
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving email queue", error });
        }
    }
    async create(req, res) {
        try {
            const item = await service.postEmailQueue(req.body);
            res.status(201).json(item);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating email queue", error });
        }
    }
    async update(req, res) {
        try {
            const success = await service.putEmailQueue(parseInt(req.params.id), req.body);
            if (!success)
                return res.status(404).json({ message: "Email queue not found" });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error updating email queue", error });
        }
    }
    async delete(req, res) {
        try {
            const success = await service.deleteEmailQueue(parseInt(req.params.id));
            if (!success)
                return res.status(404).json({ message: "Email queue not found" });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting email queue", error });
        }
    }
}
exports.EmailQueueController = EmailQueueController;
