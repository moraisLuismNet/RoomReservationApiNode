"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const data_source_1 = require("../config/data/data-source");
const EmailQueue_1 = require("../models/EmailQueue");
class EmailQueueService {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(EmailQueue_1.EmailQueue);
    }
    async getAllEmailQueues() {
        const items = await this.repository.find();
        return items.map((i) => this.mapToDTO(i));
    }
    async getEmailQueue(emailQueueId) {
        const item = await this.repository.findOneBy({ emailQueueId });
        return item ? this.mapToDTO(item) : null;
    }
    async postEmailQueue(dto) {
        const item = new EmailQueue_1.EmailQueue();
        item.toEmail = dto.toEmail;
        item.subject = dto.subject;
        item.body = dto.body;
        item.emailType = dto.emailType;
        item.scheduledSendTime = new Date();
        const saved = await this.repository.save(item);
        return this.mapToDTO(saved);
    }
    async putEmailQueue(emailQueueId, dto) {
        const item = await this.repository.findOneBy({ emailQueueId });
        if (!item)
            return false;
        item.status = dto.status;
        item.scheduledSendTime = dto.scheduledSendTime;
        await this.repository.save(item);
        return true;
    }
    async deleteEmailQueue(emailQueueId) {
        const result = await this.repository.delete(emailQueueId);
        return result.affected !== 0;
    }
    mapToDTO(i) {
        return {
            emailQueueId: i.emailQueueId,
            toEmail: i.toEmail,
            subject: i.subject,
            status: i.status,
            attempts: i.attempts,
            scheduledSendTime: i.scheduledSendTime,
            sentAt: i.sentAt,
            errorMessage: i.errorMessage,
            createdAt: i.createdAt,
        };
    }
}
exports.EmailQueueService = EmailQueueService;
