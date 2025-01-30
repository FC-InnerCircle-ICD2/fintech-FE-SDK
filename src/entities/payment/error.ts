import { BaseError, type ErrorCode, type ErrorName } from '@shared/error';

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

type PaymentErrorName = ErrorName<typeof PAYMENT_ERROR>;
type PaymentErrorCode = ErrorCode<typeof PAYMENT_ERROR>;

export class PaymentError extends BaseError<PaymentErrorName> {
  constructor(params: {
    name: PaymentErrorName;
    message: string;
    cause?: unknown;
    code?: PaymentErrorCode;
  }) {
    super(params);
    this.name = params.name;
  }
}
