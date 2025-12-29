import { AppDataSource } from "../config/data/data-source";
import { EmailQueue } from "../models/EmailQueue";

export class EmailService {
  private repository = AppDataSource.getRepository(EmailQueue);

  async sendEmailAsync(
    toEmail: string,
    subject: string,
    body: string,
    emailType: string,
    reservationId?: number
  ) {
    const email = new EmailQueue();
    email.toEmail = toEmail;
    email.subject = subject;
    email.body = body;
    email.emailType = emailType;
    email.status = "pending";
    email.scheduledSendTime = new Date();
    email.reservationId = reservationId;

    await this.repository.save(email);

    // Process queue asynchronously (don't wait for it in the request)
    this.processEmailQueue().catch((err) =>
      console.error("Error processing email queue:", err)
    );
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
      } catch (error: any) {
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

  private async sendEmail(email: EmailQueue) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY not configured");
    }

    const senderEmail = process.env.EMAIL_FROM_EMAIL;
    const senderName = process.env.EMAIL_FROM_NAME;

    if (!senderEmail || !senderName) {
      throw new Error(
        "Email sender configuration is missing (EMAIL_FROM_EMAIL or EMAIL_FROM_NAME)"
      );
    }

    const payload = {
      sender: {
        email: senderEmail,
        name: senderName,
      },
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
      throw new Error(
        `Failed to send email: ${response.status} - ${errorText}`
      );
    }
  }
}
