import { createPaymentApi } from '@entities/payment';
import { createHttpClient } from '@shared/api';
import { API_ENDPOINTS, DUMMY_API_CONFIG } from '@shared/config';
import { createSSE } from '@shared/lib/createSSE';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('@app/mocks/browser');

  worker.start();
}

const httpClient = createHttpClient();
const paymentApi = createPaymentApi(httpClient);

const responseBox = document.querySelector('#response-test')!;
const requestPayment = document.querySelector('button#request-payment-test');
const subscribePaymentEvents = document.querySelector(
  'button#subscribe-payment-events-test',
);

requestPayment!.addEventListener('click', async () => {
  try {
    const response = await paymentApi.requestPayment({
      id: DUMMY_API_CONFIG.ORDER.ID,
      amount: DUMMY_API_CONFIG.ORDER.AMOUNT,
      orderName: DUMMY_API_CONFIG.ORDER.NAME,
      successUrl: DUMMY_API_CONFIG.ORDER.SUCCESS_URL,
    });

    responseBox!.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
  } catch (error) {
    responseBox!.innerHTML = `<pre>${JSON.stringify(error, null, 2)}</pre>`;
  }
});

const initializePaymentEventStream = () => {
  const paymentEvents = createSSE<{
    status: string;
    merchantId: string;
    orderId: string;
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
          console.log('결제 검증 상태:', data);
        },
        'payment-in-progress': (data) => {
          console.log('결제 진행 상태:', data);
        },
        'payment-done': (data) => {
          console.log('결제 완료 상태:', data);
          paymentEvents.close();
        },
        'payment-canceled': (data) => {
          console.log('결제 취소 상태:', data);
          paymentEvents.close();
        },
      },
    },
  );

  return () => {
    paymentEvents.close();
  };
};

subscribePaymentEvents!.addEventListener('click', async () => {
  const cleanup = initializePaymentEventStream();

  setTimeout(() => {
    cleanup();
  }, 25000);
});
