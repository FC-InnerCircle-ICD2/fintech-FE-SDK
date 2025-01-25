import { BaseError } from '@shared/error';

export const PAYMENT_ERROR = {
  INVALID_PARAMS: {
    name: 'PAYMENT_INVALID_PARAMS',
    message: '결제 정보가 유효하지 않습니다.',
  },
  INVALID_DATE: {
    name: 'PAYMENT_INVALID_DATE',
    message: '만료 시간 형식이 올바르지 않습니다.',
  },
  EXPIRED: {
    name: 'PAYMENT_EXPIRED',
    message: '결제 정보가 이미 만료되었습니다.',
  },
  REQUEST_FAILED: {
    name: 'PAYMENT_REQUEST_FAILED',
    message: '결제 요청에 실패했습니다.',
    code: 400,
  },
  CONNECTION_FAILED: {
    name: 'PAYMENT_CONNECTION_FAILED',
    message: '결제 이벤트 연결에 실패했습니다.',
    code: 1001,
  },
} as const;

export type PaymentErrorName =
  (typeof PAYMENT_ERROR)[keyof typeof PAYMENT_ERROR]['name'];

type PaymentErrorWithCode = {
  [K in keyof typeof PAYMENT_ERROR]: (typeof PAYMENT_ERROR)[K] extends {
    code: infer C;
  }
    ? C
    : never;
}[keyof typeof PAYMENT_ERROR];

export type PaymentErrorCode = Exclude<PaymentErrorWithCode, never>;

export class PaymentError extends BaseError<PaymentErrorName> {
  constructor(params: {
    name: PaymentErrorName;
    message: string;
    cause?: unknown;
  }) {
    super(params);
    this.name = params.name;
  }
}
