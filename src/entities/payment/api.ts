import { PAYMENT_ERROR, PaymentError } from './error';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import type { ApiKey, PaymentApi } from './types';
import { createSSE } from '@shared/lib';

export const createPaymentApi = ({ apiKey }: ApiKey): PaymentApi => {
  return {
    requestPayment: async (body) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.REQUEST_PAYMENT}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(`${apiKey}:`)}`,
            },
            body: JSON.stringify(body),
          },
        );

        if (!response.ok) {
          throw new PaymentError({
            name: PAYMENT_ERROR.REQUEST_FAILED.name,
            message: `HTTP Error: ${response.status} ${response.statusText}`,
            cause: {
              status: response.status,
              statusText: response.statusText,
            },
          });
        }

        const data = await response.json();

        if (data.ok) {
          return data;
        }

        throw new PaymentError({
          name: PAYMENT_ERROR.REQUEST_FAILED.name,
          message: data.error?.message || PAYMENT_ERROR.REQUEST_FAILED.message,
          cause: data.error,
        });
      } catch (error) {
        if (error instanceof PaymentError) {
          throw error;
        }

        // 기타 예상치 못한 에러
        // throw new PaymentError({
        //   name: PAYMENT_ERROR.UNKNOWN_ERROR.name,
        //   message: '결제 처리 중 오류가 발생했습니다',
        //   cause: error,
        // });
      }
    },

    subscribePaymentEvents: async ({ orderId, close, successUrl }) => {
      const paymentEvents = createSSE<{
        status: string;
        merchantId: string;
        orderId: string;
        paymentKey?: string;
        cardNumber?: string;
        amount?: number;
      }>(
        `${API_BASE_URL}${API_ENDPOINTS.SUBSCRIBE_PAYMENT_EVENTS}?orderId=${orderId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Basic ${btoa(`${apiKey}:`)}`,
          },
          onStateChange: (state) => {
            console.log(`결제 이벤트 스트림 상태: ${state}`);
          },
          maxRetries: 3,
        },
        {
          onOpen: () => {
            console.log('결제 이벤트 스트림 연결됨');
          },
          onError: (error) => {
            console.error('결제 이벤트 스트림 에러:', error);
          },
          eventHandlers: {
            'payment-ready': (data) => {
              console.log('결제 준비 상태:', data);
            },
            'payment-in-verificate': (data) => {
              console.log('결제 수단 검증 상태:', data);
            },
            'payment-in-progress': (data) => {
              console.log('♻️ 결제가 진행중입니다.');

              if (data?.paymentKey) {
                window.location.href =
                  successUrl +
                  `?paymentKey=${data.paymentKey}&orderId=${data.orderId}&amount=${data.amount}`;
              }
            },
            'payment-done': (data) => {
              console.log('🎉 결제가 완료되었습니다.');
              console.log('결제 완료 상태:', data);
              close();
              paymentEvents.close();
            },
            'payment-canceled': (data) => {
              console.log('🚫 결제가 취소되었습니다.');
              console.log('결제 취소 상태:', data);
              close();
              paymentEvents.close();
            },
          },
        },
      );
    },
  };
};
