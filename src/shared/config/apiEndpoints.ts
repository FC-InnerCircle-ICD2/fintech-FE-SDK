export const API_ENDPOINTS = {
  REQUEST_PAYMENT: '/api/v1/p/merchant',
  SUBSCRIBE_PAYMENT_EVENTS: '/api/v1/p/merchant/sse/connect',
} as const;

export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://payment.pay-200.com'
    : '/proxy';
