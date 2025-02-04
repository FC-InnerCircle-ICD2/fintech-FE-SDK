import { createPaymentApi } from '@entities/payment';
import { createHttpClient } from '@shared/api';
import { DUMMY_API_CONFIG } from '@shared/config';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('@app/mocks/browser');

  worker.start();
}

const httpClient = createHttpClient();
const paymentApi = createPaymentApi(httpClient);

const $response = document.querySelector('#response-test')!;
const $requestPayment = document.querySelector('button#request-payment-test');
const $subscribePaymentEvents = document.querySelector(
  'button#subscribe-payment-events-test',
);

$requestPayment!.addEventListener('click', async () => {
  try {
    const response = await paymentApi.requestPayment({
      id: DUMMY_API_CONFIG.ORDER.ID,
      amount: DUMMY_API_CONFIG.ORDER.AMOUNT,
      orderName: DUMMY_API_CONFIG.ORDER.NAME,
      successUrl: DUMMY_API_CONFIG.ORDER.SUCCESS_URL,
    });

    $response!.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
  } catch (error) {
    $response!.innerHTML = `<pre>${JSON.stringify(error, null, 2)}</pre>`;
  }
});

$subscribePaymentEvents!.addEventListener('click', async () => {
  const eventSource = paymentApi.subscribePaymentEvents(
    DUMMY_API_CONFIG.ORDER_TOKEN,
    '?scenario=SUCCESS&delay=1000',
  );

  eventSource.onerror = (error) => {
    $response!.innerHTML += `Error: ${JSON.stringify(error, null, 2)}\n`;
    eventSource.close();
  };

  eventSource.addEventListener('method-verification', (event) => {
    $response!.innerHTML += `Method Verification: ${JSON.stringify(JSON.parse(event.data), null, 2)}}\n`;
  });

  eventSource.addEventListener('payment-approval', (event) => {
    $response!.innerHTML += `Payment Approval: ${JSON.stringify(JSON.parse(event.data), null, 2)}}\n`;
  });

  setTimeout(() => {
    eventSource.close();
    $response!.innerHTML += `Closed.</pre>`;
  }, 10000);
});
