import {
  createPaymentApi,
  createRedirectURL,
  type Order,
  type RedirectURL,
  renderPaymentWindow,
} from '@entities/payment';
import { createHttpClient } from '@shared/api';
import { API_ENDPOINTS } from '@shared/config';
import { createSSE, detectExpiredToken } from '@shared/lib';

export const pay200SDK = ({ apiKey }: { apiKey: string }) => {
  const httpClient = createHttpClient({
    prefixUrl: '',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${apiKey}:`)}`,
    },
  });

  const paymentApi = createPaymentApi(httpClient);

  const requestPayment = async ({
    id,
    amount,
    orderName,
    successUrl,
  }: Order & RedirectURL) => {
    try {
      const { code, data, error } = await paymentApi.requestPayment({
        id,
        amount,
        orderName,
        successUrl,
      });

      if (code !== 200 || !data) {
        throw error;
      }

      const { token, expiredAt } = data;

      const redirectURL = createRedirectURL({
        token,
        expiredAt,
      });

      const closePaymentWindow = renderPaymentWindow(redirectURL);

      detectExpiredToken(expiredAt, closePaymentWindow);

      const paymentEvents = createSSE<{
        status: string;
        merchantId: string;
        orderId: string;
        successURL?: string;
      }>(
        API_ENDPOINTS.SUBSCRIBE_PAYMENT_EVENTS,
        {
          withCredentials: true,
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

              if (data?.successURL) {
                console.log(
                  '✅ 결제 정보 검증을 위해 가맹점 웹 서버로 결제 API 요청 중...',
                );
                // await fetch(data.successURL);
                // closePaymentWindow();
              }
            },
            'payment-in-progress': (data) => {
              console.log('♻️ 결제가 진행중입니다.');
              console.log('결제 진행 상태:', data);
            },
            'payment-done': (data) => {
              console.log('🎉 결제가 완료되었습니다.');
              console.log('결제 완료 상태:', data);
              closePaymentWindow();
              paymentEvents.close();
            },
            'payment-canceled': (data) => {
              console.log('🚫 결제가 취소되었습니다.');
              console.log('결제 취소 상태:', data);
              closePaymentWindow();
              paymentEvents.close();
            },
          },
        },
      );
    } catch (error) {
      console.error('👀 [pay200SDK] error', error);
      throw error;
    }
  };

  return requestPayment;
};
