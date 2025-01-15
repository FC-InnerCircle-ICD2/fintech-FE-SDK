export const API_ENDPOINTS = {
  REQUEST_PAYMENT: 'api/v1/payments',
  LISTEN_PAYMENT_EVENTS: (orderToken: string) =>
    `api/v1/payments/${orderToken}/events`,
} as const;
