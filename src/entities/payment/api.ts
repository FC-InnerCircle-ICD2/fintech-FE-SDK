import { type HttpClient } from '../../shared/api/http-client';

export type Order = {
  id: string;
  amount: number;
  orderName: string;
};

export type RedirectURL = {
  successUrl: string;
  failUrl: string;
};

export type PaymentApi = {
  requestPayment: (
    body: Order & RedirectURL,
  ) => Promise<{ token: string; expiredAt: string }>;
  subscribePaymentEvents: (token: string) => EventSource;
};

export const createPaymentApi = (httpClient: HttpClient): PaymentApi => {
  return {
    requestPayment: async (body) => {
      const response = await httpClient.post<
        Order & RedirectURL,
        { token: string; expiredAt: string }
      >('/api/v1/payments', body);

      if (response.code === 200) {
        return response.data;
      } else {
        throw new Error(response.message || 'Payment request failed');
      }
    },

    subscribePaymentEvents: (token: string): EventSource => {
      const eventSource = new EventSource(`/api/v1/payments/${token}/events`, {
        withCredentials: true,
      });

      return eventSource;
    },
  };
};
