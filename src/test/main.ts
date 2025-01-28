import { renderPaymentWindow } from '@shared/lib/renderPaymentWindow';
import { createPaymentApi } from '@entities/payment';
import { createHttpClient } from '@shared/api';
import { MOBILE_APP_PATH } from '@shared/config';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('@app/mocks/browser');

  worker.start();
}

const httpClient = createHttpClient();
const paymentApi = createPaymentApi(httpClient);

console.log('👀 [main.ts] paymentApi', paymentApi);

const requestPaymentTestButton = document.querySelector(
  'button#pay-button-test',
);

requestPaymentTestButton!.addEventListener('click', async () => {
  renderPaymentWindow(
    MOBILE_APP_PATH.REDIRECT_URL('token', '2025-02-01 00:00:00'),
  );
});
