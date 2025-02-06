import { pay200SDK } from '@app/sdk';
import { MOBILE_APP_PATH } from '@shared/config';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('@app/mocks/browser');

  worker.start();
}

const requestPaymentTestButton = document.querySelector(
  'button#pay-button-test',
);

requestPaymentTestButton!.addEventListener('click', async () => {
  const requestPayment = pay200SDK({
    apiKey: '1234567890',
  });

  await requestPayment({
    id: '1234567890',
    amount: 1000,
    orderName: 'test',
    successUrl: MOBILE_APP_PATH.REDIRECT_URL('token', '2025-02-01 00:00:00'),
  });
});
