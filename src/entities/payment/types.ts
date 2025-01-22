import type { Response } from '@shared/api';

export type Order = {
  id: string;
  amount: number;
  orderName: string;
};

export type RedirectURL = {
  successUrl: string;
  failureUrl: string;
};

export type PaymentReq = Order & RedirectURL;
export type PaymentRes = { token: string; expiredAt: string };

export type PaymentApi = {
  requestPayment: (body: PaymentReq) => Promise<Response<PaymentRes>>;
  subscribePaymentEvents: (token: string, queryString?: string) => EventSource;
};
