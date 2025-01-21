import { createPaymentApi } from '../entities/payment/api';
import { createHttpClient } from '../shared/api/httpClient';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('../app/mocks/browser');

  worker.start();
}

const httpClient = createHttpClient();
const paymentApi = createPaymentApi(httpClient);

console.log('👀 [main.ts] paymentApi', paymentApi);

const requestPaymentTestButton = document.querySelector(
  'button#pay-button-test',
);

requestPaymentTestButton!.addEventListener('click', async () => {});
