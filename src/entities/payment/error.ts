export const PAYMENT_ERROR = {
  INVALID_PARAMS: 'PAYMENT_INVALID_PARAMS',
  INVALID_DATE: 'PAYMENT_INVALID_DATE',
  EXPIRED: 'PAYMENT_EXPIRED',
} as const;

export class PaymentError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
