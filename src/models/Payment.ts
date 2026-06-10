export class Payment {
  paymentId: number;
  amount: number;
  status: string;
  paymentDate: Date;

  constructor(paymentId: number, amount: number, status: string, paymentDate: Date) {
    this.paymentId = paymentId;
    this.amount = amount;
    this.status = status;
    this.paymentDate = paymentDate;
  }

  processPayment(): boolean {
    return false;
  }

  refund(): boolean {
    return false;
  }

  getReceipt(): string {
    return "";
  }
}
