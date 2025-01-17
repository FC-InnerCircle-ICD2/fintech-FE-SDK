import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints';
import { DUMMY_API_CONFIG } from '../../shared/config/dummy';

export const handlers = [
  // request payment api
  http.post<
    object,
    { orderId: string; amount: number; successURL: string },
    {
      code: number;
      data: { orderToken: string; expiredAt: string } | null;
      error: { code: number; message: string } | null;
    }
  >(API_ENDPOINTS.REQUEST_PAYMENT, async ({ request }) => {
    const { orderId, amount, successURL } = await request.json();

    console.log('👀 request body', {
      orderId,
      amount,
      successURL,
    });

    // response when request succeed
    return HttpResponse.json(
      {
        code: 200,
        data: {
          orderToken: DUMMY_API_CONFIG.ORDER_TOKEN,
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
  }),

  // connect payment events api
  http.get(API_ENDPOINTS.LISTEN_PAYMENT_EVENTS(':token'), ({ params }) => {
    const { token } = params;

    console.log('👀 token', token);

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        if (token !== DUMMY_API_CONFIG.ORDER_TOKEN) {
          controller.enqueue(
            encoder.encode(
              `event: ${DUMMY_API_CONFIG.PAYMENT_EVENTS.RESULT}\ndata: ${JSON.stringify(
                {
                  type: DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.RESULT.FAILURE,
                  data: 'Unauthorized',
                },
              )}\n\n`,
            ),
          );

          return;
        }

        // send event when payment method is ready
        controller.enqueue(
          encoder.encode(
            `event: ${DUMMY_API_CONFIG.PAYMENT_EVENTS.METHOD}\ndata: ${JSON.stringify(
              {
                type: DUMMY_API_CONFIG.PAYMENT_EVENTS.METHOD,
                data: DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.METHOD,
              },
            )}\n\n`,
          ),
        );

        // send event when payment succeed
        setTimeout(() => {
          controller.enqueue(
            encoder.encode(
              `event: ${DUMMY_API_CONFIG.PAYMENT_EVENTS.RESULT}\ndata: ${JSON.stringify(
                {
                  type: DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.RESULT.SUCCESS,
                  data: 'Completed',
                },
              )}\n\n`,
            ),
          );

          controller.close();
        }, 5000);

        // send event when payment failed
        // setTimeout(() => {
        //   controller.enqueue(
        //     encoder.encode(
        //       `event: ${DUMMY_API_CONFIG.PAYMENT_EVENTS.RESULT}\ndata: ${JSON.stringify(
        //         {
        //           type: DUMMY_API_CONFIG.PAYMENT_EVENTS.DATA.RESULT.FAILURE,
        //           data: 'Failed',
        //         },
        //       )}\n\n`,
        //     ),
        //   );
        // }, 5000);
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  }),
];
