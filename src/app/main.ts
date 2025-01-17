import { API_BASE_URL, API_ENDPOINTS } from '../shared/config/api-endpoints';
import { DUMMY_API_CONFIG } from '../shared/config/dummy';

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('../app/mocks/browser');

  worker.start();
}

const responseBox = document.querySelector('#response-box')!;

const requestPaymentTestButton = document.querySelector(
  'button#request-payment-test',
);

requestPaymentTestButton!.addEventListener('click', async () => {
  const response = await fetch(API_BASE_URL + API_ENDPOINTS.REQUEST_PAYMENT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...DUMMY_API_CONFIG.ORDER }),
  });

  const data = await response.json();

  responseBox!.innerHTML = `
    <p>
      - code: <b>${data.code}</b>
      <br />
      - data
      <br />
      - orderToken: <b>${data.data.orderToken}</b>
      <br />
      - expiredAt: <b>${data.data.expiredAt}</b>
    </p>
  `;
});

const listenPaymentEventsButton = document.querySelector(
  'button#listen-payment-events-test',
);
listenPaymentEventsButton!.addEventListener('click', async () => {
  const eventSource = new EventSource(
    API_BASE_URL +
      API_ENDPOINTS.LISTEN_PAYMENT_EVENTS(DUMMY_API_CONFIG.ORDER_TOKEN),
  );

  eventSource.addEventListener(
    DUMMY_API_CONFIG.PAYMENT_EVENTS.METHOD,
    (event) => {
      const data = JSON.parse(event.data);

      responseBox!.innerHTML = `
          <p>
            - type: <b>${data.type}</b>
            <br />
            - data: <b>${JSON.stringify(data.data)}</b>
          </p>
        `;

      if (data.type === DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.RESULT.SUCCESS) {
        eventSource.close();
      }
    },
  );

  eventSource.addEventListener(
    DUMMY_API_CONFIG.PAYMENT_EVENTS.RESULT,
    (event) => {
      const data = JSON.parse(event.data);

      responseBox!.innerHTML = `
          <p>
            - type: <b>${data.type}</b>
            <br />
            - data: <b>${JSON.stringify(data.data)}</b>
          </p>
        `;

      if (data.type === DUMMY_API_CONFIG.PAYMENT_EVENTS.METHOD) {
        eventSource.close();
      }
    },
  );

  eventSource.onerror = (error) => {
    console.error('👀 [main.ts] EventSource failed:', error);
    eventSource.close();
  };
});
