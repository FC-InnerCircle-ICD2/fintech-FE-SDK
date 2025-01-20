export const API_ENDPOINTS = {
  REQUEST_PAYMENT: 'api/v1/payments',
  SUBSCRIBE_PAYMENT_EVENTS: (orderToken: string) =>
    `api/v1/payments/${orderToken}/events`,
} as const;

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
