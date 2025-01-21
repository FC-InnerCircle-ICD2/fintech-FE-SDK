import { http, HttpResponse } from 'msw';
import type { PaymentReq, PaymentRes } from '../../entities/payment/types';
import type { Response } from '../../shared/api/httpClient';
import { API_ENDPOINTS } from '../../shared/config/apiEndpoints';
import { DUMMY_API_CONFIG } from '../../shared/config/dummy';

export type EventName = 'payments' | 'method-verification' | 'payment-approval';

export const SCENARIOS = {
  SUCCESS: { code: 200, message: 'success' },
  ERROR: {
    SERVER: { code: 500, message: 'internal_server_error' },
    TOKEN: { code: 401, message: 'unauthorized_token' },
    // PAYMENT_METHOD: {
    //   PLAIN: { code: 500, message: 'payment_method_error' },
    //   INVALID: { code: 400, message: 'invalid_payment_method' },
    // },
    // PAYMENT: {
    //   PLAIN: { code: 500, message: 'payment_approval_error' },
    //   INVALID: { code: 400, message: 'invalid_order_info' },
    //   REJECT: { code: 403, message: 'reject_payment_approval' },
    // },
  },
} as const;

type PaymentMethodRes = {
  successURL: string;
};

type PaymentApprovalRes = {
  paymentKey: string;
};

export type Event<T> = {
  data: {
    timestamp: string;
    code: number;
    data: T | null;
    error: {
      code: number;
      message: string;
    } | null;
  };
};

const createEvent = <T>(
  eventName: EventName,
  code: number,
  data: T | null = null,
  error: { code: number; message: string } | null = null,
) => {
  const eventData: Event<T> = {
    data: {
      timestamp: new Date().toISOString(),
      code,
      data,
      error,
    },
  };

  return `event: ${eventName}\ndata: ${JSON.stringify(eventData)}\n\n`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const successURL = `${DUMMY_API_CONFIG.ORDER.SUCCESS_URL}?amount=${DUMMY_API_CONFIG.ORDER.AMOUNT}&id=${DUMMY_API_CONFIG.ORDER.ID}`;

export const handlers = [
  // request payment api
  http.post<object, PaymentReq, Response<PaymentRes>>(
    API_ENDPOINTS.REQUEST_PAYMENT,
    async ({ request }) => {
      const { id, amount, orderName, successUrl, failureUrl } =
        await request.json();

      console.log(
        '👀 [handlers.ts] Request Body',
        id,
        amount,
        orderName,
        successUrl,
        failureUrl,
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
  http.get(
    API_ENDPOINTS.SUBSCRIBE_PAYMENT_EVENTS(':token'),
    ({ params, request }) => {
      const { token } = params;
      const url = new URL(request.url);
      const scenario = url.searchParams.get('scenario') || 'SUCCESS';
      const delay = Number(url.searchParams.get('delay')) || 0;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            if (delay) {
              await sleep(delay);
            }

            // Unauthorized Token Scenario
            if (token !== DUMMY_API_CONFIG.ORDER_TOKEN) {
              controller.enqueue(
                encoder.encode(
                  createEvent<null>(
                    'payments',
                    SCENARIOS.ERROR.TOKEN.code,
                    null,
                    SCENARIOS.ERROR.TOKEN,
                  ),
                ),
              );
              controller.close();
              return;
            }

            switch (scenario) {
              // case 'NETWORK_ERROR':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<null>(
              //         'method-verification',
              //         STATUS.NETWORK_ERROR,
              //         null,
              //         {
              //           code: STATUS.NETWORK_ERROR,
              //           message: ERROR_MESSAGES.NETWORK_ERROR,
              //         },
              //       ),
              //     ),
              //   );
              //   break;

              case 'PAYMENT_METHOD_ERROR':
              case 'INVALID_PAYMENT_METHOD':
              case 'PAYMENT_ERROR':
              case 'INVALID_PAYMENT':
              case 'REJECT_PAYMENT':
                controller.enqueue(
                  encoder.encode(
                    createEvent<PaymentMethodRes>(
                      'payments',
                      SCENARIOS.ERROR.SERVER.code,
                      null,
                      SCENARIOS.ERROR.SERVER,
                    ),
                  ),
                );
                break;

              // case 'PAYMENT_METHOD_ERROR':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.ERROR.PAYMENT_METHOD.PLAIN.code,
              //         null,
              //         SCENARIOS.ERROR.PAYMENT_METHOD.PLAIN,
              //       ),
              //     ),
              //   );
              //   break;

              // case 'INVALID_PAYMENT_METHOD':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.ERROR.PAYMENT_METHOD.INVALID.code,
              //         null,
              //         SCENARIOS.ERROR.PAYMENT_METHOD.INVALID,
              //       ),
              //     ),
              //   );
              //   break;

              // case 'PAYMENT_ERROR':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.SUCCESS.code,
              //         { successURL },
              //         null,
              //       ),
              //     ),
              //   );

              //   await sleep(1000);

              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.ERROR.PAYMENT.PLAIN.code,
              //         null,
              //         SCENARIOS.ERROR.PAYMENT.PLAIN,
              //       ),
              //     ),
              //   );
              //   break;

              // case 'INVALID_PAYMENT':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.SUCCESS.code,
              //         { successURL },
              //         null,
              //       ),
              //     ),
              //   );

              //   await sleep(1000);

              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.ERROR.PAYMENT.INVALID.code,
              //         null,
              //         SCENARIOS.ERROR.PAYMENT.INVALID,
              //       ),
              //     ),
              //   );
              //   break;

              // case 'REJECT_PAYMENT':
              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.SUCCESS.code,
              //         { successURL },
              //         null,
              //       ),
              //     ),
              //   );

              //   await sleep(1000);

              //   controller.enqueue(
              //     encoder.encode(
              //       createEvent<PaymentMethodRes>(
              //         'method-verification',
              //         SCENARIOS.ERROR.PAYMENT.REJECT.code,
              //         null,
              //         SCENARIOS.ERROR.PAYMENT.REJECT,
              //       ),
              //     ),
              //   );
              //   break;

              default:
                controller.enqueue(
                  encoder.encode(
                    createEvent<PaymentMethodRes>(
                      'method-verification',
                      SCENARIOS.SUCCESS.code,
                      { successURL },
                      null,
                    ),
                  ),
                );

                await sleep(5000);

                controller.enqueue(
                  encoder.encode(
                    createEvent<PaymentApprovalRes>(
                      'payment-approval',
                      SCENARIOS.SUCCESS.code,
                      { paymentKey: 'abcdef' },
                      null,
                    ),
                  ),
                );
            }

            controller.close();
          } catch (error) {
            controller.error(error);
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
    },
  ),
];
