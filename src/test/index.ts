import { pay200SDK } from '@app/sdk';

// Mocking
// if (process.env.NODE_ENV === 'development') {
//   const { worker } = await import('@app/mocks/browser');

//   worker.start();
// }

const requestPaymentTestButton = document.querySelector(
  'button#pay-button-test',
);

requestPaymentTestButton!.addEventListener('click', async () => {
  const requestPayment = pay200SDK({
    apiKey: 'pay200',
  });

  await requestPayment({
    orderId: '123',
    amount: 5000000,
    orderName: 'MacBook Pro 15 M5 Max',
  });
});
