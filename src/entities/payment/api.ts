import { PAYMENT_ERROR, PaymentError } from '@entities/payment/error';
import type { HttpClient } from '@shared/api';
import { API_ENDPOINTS } from '@shared/config';
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
      }

      throw new PaymentError({
        name: PAYMENT_ERROR.REQUEST_FAILED.name,
        message:
          response.error?.message || PAYMENT_ERROR.REQUEST_FAILED.message,
        cause: response.error,
      });
    },

    subscribePaymentEvents: (token: string, queryString = ''): EventSource => {
      const eventSource = new EventSource(
        API_ENDPOINTS.SUBSCRIBE_PAYMENT_EVENTS(token) + queryString,
        {
          withCredentials: true,
        },
      );

      return eventSource;
    },
  };
};
