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
  failUrl: string;
};

export type RequestPaymentReq = Order;
export type RequestPaymentRes = { token: string; expiredAt: string };
export type SubscribePaymentEventsReq = Pick<Order, 'orderId'> &
  Pick<RedirectURL, 'successUrl' | 'failUrl'> & {
    close: () => void;
  };

export type EventSourceHandler = {
  close: () => void;
  getState: () => string;
  addEventListener: <K>(
    eventName: string,
    callback: (data: K) => void,
  ) => () => void;
};

export type SubscribePaymentEventsRes = EventSourceHandler;

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
