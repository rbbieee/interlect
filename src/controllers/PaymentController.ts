import { Payment } from "../models/Payment";

export class PaymentController {
  processPayment(payment: Payment): boolean {
    return false;
  }

  verifyPayment(paymentId: number): boolean {
    return false;
  }
}
