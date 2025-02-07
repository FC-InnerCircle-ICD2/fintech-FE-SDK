import { pay200SDK } from '@app/sdk';

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
    successUrl: 'https://example.com',
  });
});
