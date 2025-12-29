import { AppDataSource } from "../config/data/data-source";
import { Reservation } from "../models/Reservation";
import { User } from "../models/User";
import {
  CreateCheckoutSessionDTO,
  CheckoutSessionResponseDTO,
} from "../dtos/payment.dto";
import {
  ReservationStatus,
  ReservationStatusName,
} from "../models/ReservationStatus";
import { EmailService } from "./EmailService";

export class PaymentService {
  private reservationRepository = AppDataSource.getRepository(Reservation);
  private userRepository = AppDataSource.getRepository(User);
  private statusRepository = AppDataSource.getRepository(ReservationStatus);
  private emailService = new EmailService();

  async createCheckoutSession(
    request: CreateCheckoutSessionDTO
  ): Promise<CheckoutSessionResponseDTO> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: request.reservationId },
      relations: ["room"],
    });

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Stripe Secret Key not configured");

    // Stripe API expects x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("payment_method_types[0]", "card");
    params.append("locale", "en");
    params.append("mode", "payment");
    params.append(
      "success_url",
      `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&reservation_id=${request.reservationId}`
    );
    params.append(
      "cancel_url",
      `${process.env.STRIPE_CANCEL_URL}?reservation_id=${request.reservationId}`
    );
    params.append(
      "line_items[0][price_data][currency]",
      request.currency || "usd"
    );
    params.append(
      "line_items[0][price_data][unit_amount]",
      Math.round(request.amount * 100).toString()
    );
    params.append(
      "line_items[0][price_data][product_data][name]",
      request.productName || `Room Reservation #${request.reservationId}`
    );
    params.append("line_items[0][quantity]", "1");
    params.append("metadata[reservation_id]", request.reservationId.toString());

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Stripe error: ${JSON.stringify(error)}`);
    }

    const session = await response.json();

    return {
      sessionId: session.id,
      sessionUrl: session.url,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    };
  }

  async confirmPayment(sessionId: string): Promise<boolean> {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Stripe Secret Key not configured");

    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (!response.ok) return false;

    const session = await response.json();

    if (session.payment_status === "paid") {
      const reservationId = parseInt(session.metadata.reservation_id);
      if (reservationId) {
        return await this.confirmReservationAndSendEmail(reservationId);
      }
    }

    return false;
  }

  private async confirmReservationAndSendEmail(
    reservationId: number
  ): Promise<boolean> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ["user"],
    });

    if (!reservation) return false;

    const confirmedStatus = await this.statusRepository.findOneBy({
      name: ReservationStatusName.CONFIRMED,
    });
    if (!confirmedStatus) return false;

    reservation.statusId = confirmedStatus.statusId; // Confirmed
    await this.reservationRepository.save(reservation);

    const user = reservation.user;
    const emailSubject = "Booking Confirmation - Payment Received";
    const emailBody = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${user.fullName || "Customer"},</p>
      <p>Your payment has been received and your booking is now confirmed.</p>
      <p><strong>Reservation Details:</strong></p>
      <ul>
          <li>Reservation ID: ${reservation.reservationId}</li>
          <li>Entry date: ${reservation.checkInDate}</li>
          <li>Departure date: ${reservation.checkOutDate}</li>
      </ul>
      <p>Thank you for choosing our hotel. We look forward to your stay!</p>
    `;

    await this.emailService.sendEmailAsync(
      user.email,
      emailSubject,
      emailBody,
      "confirmation",
      reservation.reservationId
    );
    return true;
  }
}
