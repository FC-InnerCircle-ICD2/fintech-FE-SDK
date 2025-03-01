import { BaseError, type ErrorCode, type ErrorName } from '@shared/error';

export const PAYMENT_RENDER_ERROR = {
  RENDER_FAILED: {
    name: 'RENDER_FAILED',
    message: '렌더링에 실패했습니다.',
  },
  WINDOW_OPEN_FAILED: {
    name: 'WINDOW_OPEN_FAILED',
    message: '새 창 열기에 실패했습니다.',
  },
  BUTTON_NOT_FOUND: {
    name: 'BUTTON_NOT_FOUND',
    message: "'다음' 버튼 요소가 존재하지 않습니다.",
  },
  DISABLED_NOT_FOUND: {
    name: 'DISABLED_NOT_FOUND',
    message: '텍스트 요소가 존재하지 않습니다.',
  },
  QR_CODE_CONTAINER_NOT_FOUND: {
    name: 'QR_CODE_CONTAINER_NOT_FOUND',
    message: 'QR 코드를 렌더링할 컨테이너 요소가 존재하지 않습니다.',
  },
  QR_CODE_RENDER_FAILED: {
    name: 'QR_CODE_RENDER_FAILED',
    message: 'QR 코드 렌더링에 실패했습니다.',
  },
} as const;

export const PAYMENT_ERROR = {
  INVALID_PARAMS: {
    name: 'PAYMENT_INVALID_PARAMS',
    message: '결제 정보가 유효하지 않습니다.',
  },
  INVALID_AMOUNT: {
    name: 'PAYMENT_INVALID_AMOUNT',
    message: '결제 금액이 유효하지 않습니다.',
  },
  INVALID_SUCCESS_URL: {
    name: 'PAYMENT_INVALID_SUCCESS_URL',
    message: '결제 성공 URL이 유효하지 않습니다.',
  },
  INVALID_FAIL_URL: {
    name: 'PAYMENT_INVALID_FAIL_URL',
    message: '결제 실패 URL이 유효하지 않습니다.',
  },
  INVALID_DATE: {
    name: 'PAYMENT_INVALID_DATE',
    message: '만료 시간 형식이 올바르지 않습니다.',
  },
  EXPIRED: {
    name: 'PAYMENT_EXPIRED',
    message: '결제 정보가 이미 만료되었습니다.',
  },
  CONNECTION_FAILED: {
    name: 'PAYMENT_CONNECTION_FAILED',
    message: '결제 이벤트 연결에 실패했습니다.',
  },
  UNKNOWN_ERROR: {
    name: 'PAYMENT_UNKNOWN_ERROR',
    message: '결제 처리 중 오류가 발생했습니다.',
  },
} as const;

export const PAYMENT_API_ERROR = {
  CARD_AUTH_FAILED: {
    name: 'CARD_AUTH_FAILED',
    message: '카드 인증 과정에서 오류가 발생했습니다.',
    code: 400,
  },
  BAD_PAYMENT_REQUEST: {
    name: 'BAD_PAYMENT_REQUEST',
    message: '잘못된 결제 요청입니다.',
    code: 400,
  },
  INVALID_CLAIM_AMOUNT: {
    name: 'INVALID_CLAIM_AMOUNT',
    message: '주문 ID와 관련된 요청 금액이 유효하지 않습니다.',
    code: 400,
  },
  CLAIM_ALREADY_EXISTS: {
    name: 'CLAIM_ALREADY_EXISTS',
    message: '주문 ID로 결제가 진행 중입니다.',
    code: 409,
  },
  PAYMENT_REQUEST_NOT_FOUND: {
    name: 'PAYMENT_REQUEST_NOT_FOUND',
    message: '결제 요청을 확인할 수 없습니다.',
    code: 404,
  },
  PAYMENT_NOT_SAVED: {
    name: 'PAYMENT_NOT_SAVED',
    message: '결제 처리 중 오류가 발생했습니다.',
    code: 500,
  },
  CARD_NOT_FOUND: {
    name: 'CARD_NOT_FOUND',
    message: '유효한 결제수단을 찾을 수 없습니다.',
    code: 404,
  },
  PAYMENT_METHOD_NOT_VERIFIED: {
    name: 'PAYMENT_METHOD_NOT_VERIFIED',
    message: '결제수단이 승인되지 못했습니다.',
    code: 403,
  },
  INVALID_ORDER_STATUS: {
    name: 'INVALID_ORDER_STATUS',
    message: '주문 상태에서는 처리될 수 없는 요청입니다.',
    code: 400,
  },
  TOKEN_NOT_FOUND: {
    name: 'TOKEN_NOT_FOUND',
    message: '토큰 정보를 확인할 수 없습니다.',
    code: 404,
  },
  TOKEN_EXPIRED: {
    name: 'TOKEN_EXPIRED',
    message: '요청한 토큰은 만료되었습니다.',
    code: 410,
  },
  TOKEN_INVALID: {
    name: 'TOKEN_INVALID',
    message: '토큰이 유효하지 않습니다.',
    code: 401,
  },
  CONNECTION_NOT_FOUND: {
    name: 'CONNECTION_NOT_FOUND',
    message: 'SSE 연결 정보를 확인할 수 없습니다.',
    code: 404,
  },
} as const;

type PaymentErrorName = ErrorName<typeof PAYMENT_ERROR>;
type PaymentApiErrorName = ErrorName<typeof PAYMENT_API_ERROR>;
type PaymentApiErrorCode = ErrorCode<typeof PAYMENT_API_ERROR>;
type PaymentRenderErrorName = ErrorName<typeof PAYMENT_RENDER_ERROR>;

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

export class PaymentApiError extends BaseError<PaymentApiErrorName> {
  constructor(params: {
    name: PaymentApiErrorName;
    message: string;
    cause?: unknown;
    code?: PaymentApiErrorCode;
  }) {
    super(params);
    this.name = params.name;
    this.code = params.code;
  }
}

export class PaymentRenderError extends BaseError<PaymentRenderErrorName> {
  constructor(params: {
    name: PaymentRenderErrorName;
    message: string;
    cause?: unknown;
  }) {
    super(params);
    this.name = params.name;
  }
}
