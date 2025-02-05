import type { PaymentReq, PaymentRes } from '@entities/payment';
import type { Response } from '@shared/api';
import { API_ENDPOINTS, DUMMY_API_CONFIG } from '@shared/config';
import { http, HttpResponse } from 'msw';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handlers = [
  // request payment api
  http.post<object, PaymentReq, Response<PaymentRes>>(
    API_ENDPOINTS.REQUEST_PAYMENT,
    async ({ request }) => {
      const { id, amount, orderName, successUrl } = await request.json();

      console.log(
        '👀 [handlers.ts] Request Body',
        id,
        amount,
        orderName,
        successUrl,
      );

      // response when request succeed
      return HttpResponse.json(
        {
          code: 200,
          data: {
            token: DUMMY_API_CONFIG.ORDER_TOKEN,
            expiredAt: new Date(Date.now() + 60 * 3 * 1000).toISOString(),
          },
          error: null,
        },
        { status: 200 },
      );

      // // response when request failed
      // return HttpResponse.json(
      //   {
      //     code: 400,
      //     data: null,
      //     error: {
      //       code: 400,
      //       message: 'Invalid request body',
      //     },
      //   },
      //   { status: 400 },
      // );
    },
  ),

  // connect payment events api
  http.get('/api/payment/v1/sse/connect', () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await sleep(3000);

          const readyEventData = {
            status: 'payment-ready',
            order_id: '1',
            merchant_id: '1_1',
          };
          controller.enqueue(
            encoder.encode(
              `event: payment-ready\ndata: ${JSON.stringify(readyEventData)}\n\n`,
            ),
          );

          await sleep(2000);

          const verificateEventData = {
            status: 'payment-in-verificate',
            order_id: '1',
            merchant_id: '1_1',
            successURL: DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.METHOD.SUCCESS,
          };
          controller.enqueue(
            encoder.encode(
              `event: payment-in-verificate\ndata: ${JSON.stringify(verificateEventData)}\n\n`,
            ),
          );

          await sleep(1000);

          const progressEventData = {
            status: 'payment-in-progress',
            order_id: '1',
            merchant_id: '1_1',
          };
          controller.enqueue(
            encoder.encode(
              `event: payment-in-progress\ndata: ${JSON.stringify(progressEventData)}\n\n`,
            ),
          );

          await sleep(2000);

          const doneEventData = {
            status: 'payment-done',
            order_id: '1',
            merchant_id: '1_1',
          };
          controller.enqueue(
            encoder.encode(
              `event: payment-done\ndata: ${JSON.stringify(doneEventData)}\n\n`,
            ),
          );
        } catch (error) {
          console.error('SSE 스트림 에러:', error);
          const cancelEventData = {
            status: 'payment-canceled',
            order_id: '1',
            merchant_id: '1_1',
          };
          controller.enqueue(
            encoder.encode(
              `event: payment-canceled\ndata: ${JSON.stringify(cancelEventData)}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
];
