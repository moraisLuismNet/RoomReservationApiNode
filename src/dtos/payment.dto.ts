export interface CreateCheckoutSessionDTO {
  reservationId: number;
  amount: number;
  currency: string;
  productName?: string;
  productDescription?: string;
}

export interface CheckoutSessionResponseDTO {
  sessionId: string;
  sessionUrl: string;
  publishableKey: string;
}

export interface ConfirmPaymentDTO {
  sessionId: string;
}
