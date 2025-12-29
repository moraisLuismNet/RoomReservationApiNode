"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const data_source_1 = require("../config/data/data-source");
const EmailQueue_1 = require("../models/EmailQueue");
class EmailService {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(EmailQueue_1.EmailQueue);
    }
    async sendEmailAsync(toEmail, subject, body, emailType, reservationId) {
        const email = new EmailQueue_1.EmailQueue();
        email.toEmail = toEmail;
        email.subject = subject;
        email.body = body;
        email.emailType = emailType;
        email.status = "pending";
        email.scheduledSendTime = new Date();
        email.reservationId = reservationId;
        await this.repository.save(email);
        // Process queue asynchronously (don't wait for it in the request)
        this.processEmailQueue().catch((err) => console.error("Error processing email queue:", err));
    }
    async processEmailQueue() {
        const pendingEmails = await this.repository.find({
            where: { status: "pending" },
        });
        for (const email of pendingEmails) {
            try {
                await this.sendEmail(email);
                email.status = "sent";
                email.sentAt = new Date();
            }
            catch (error) {
                email.status = "failed";
                email.errorMessage = error.message;
                email.attempts++;
                if (email.attempts < email.maxAttempts) {
                    email.status = "retrying";
                    email.scheduledSendTime = new Date(Date.now() + 5 * 60000); // 5 mins later
                }
            }
            await this.repository.save(email);
        }
    }
    async sendEmail(email) {
        const brevoApiKey = process.env.BREVO_API_KEY;
        if (!brevoApiKey) {
            throw new Error("BREVO_API_KEY not configured");
        }
        const payload = {
            sender: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME },
            to: [{ email: email.toEmail }],
            subject: email.subject,
            htmlContent: email.body,
        };
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": brevoApiKey,
                accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
        }
    }
}
exports.EmailService = EmailService;
