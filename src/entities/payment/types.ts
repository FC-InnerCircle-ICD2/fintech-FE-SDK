export type ApiKey = {
  apiKey: string;
};

export type Order = {
  orderId: string;
  amount: number;
  orderName: string;
};

export type RedirectURL = {
  successUrl: string;
};

export type RequestPaymentReq = Order;
export type RequestPaymentRes = { token: string; expiredAt: string };
export type SubscribePaymentEventsReq = Pick<Order, 'orderId'> &
  Pick<RedirectURL, 'successUrl'> & {
    close: () => void;
  };
export type SubscribePaymentEventsRes = void;

type SuccessResponse<T> = {
  ok: true;
  data: T;
  error: null;
};

type ErrorResponse = {
  ok: false;
  data: null;
  error: { code: string; message: string };
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export interface PaymentApi {
  requestPayment: (
    body: RequestPaymentReq,
  ) => Promise<Response<RequestPaymentRes>>;
  subscribePaymentEvents: ({
    orderId,
    close,
    successUrl,
  }: SubscribePaymentEventsReq) => Promise<SubscribePaymentEventsRes>;
}
