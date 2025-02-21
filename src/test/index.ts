import { pay200SDK } from '@app/sdk';

// Mocking
// if (process.env.NODE_ENV === 'development') {
//   const { worker } = await import('@app/mocks/browser');

//   worker.start();
// }

const paymentForm = document.querySelector<HTMLFormElement>('#payment-form');

paymentForm!.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderId = document.querySelector<HTMLInputElement>('#orderId')!.value;
  const amount = Number(
    document.querySelector<HTMLInputElement>('#amount')!.value,
  );
  const orderName =
    document.querySelector<HTMLInputElement>('#orderName')!.value;

  const requestPayment = pay200SDK({
    apiKey: 'pay200',
  });

  await requestPayment({
    orderId,
    amount,
    orderName,
  });
});
