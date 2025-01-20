import type { HttpClient } from '../../shared/api/httpClient';
import { API_ENDPOINTS } from '../../shared/config/apiEndpoints';
import type { PaymentApi, PaymentReq, PaymentRes } from './types';

export const createPaymentApi = (httpClient: HttpClient): PaymentApi => {
  return {
    requestPayment: async (body) => {
      const response = await httpClient.post<PaymentReq, PaymentRes>(
        API_ENDPOINTS.REQUEST_PAYMENT,
        body,
      );

      if (response.code === 200) {
        return response;
      } else {
        throw new Error(response.error?.message || 'Payment request failed');
      }
    },

    subscribePaymentEvents: (token: string): EventSource => {
      const eventSource = new EventSource(
        API_ENDPOINTS.SUBSCRIBE_PAYMENT_EVENTS(token),
        {
          withCredentials: true,
        },
      );

      return eventSource;
    },
  };
};
