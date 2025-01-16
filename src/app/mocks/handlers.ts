import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints';

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
          orderToken: 'HWgwrj5nn0WFyFGtSoANf/LAt3/goF6TNqGjrVeVEsc=',
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
];
