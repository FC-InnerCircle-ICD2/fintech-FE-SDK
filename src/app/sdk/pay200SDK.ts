import {
  createPaymentApi,
  createRedirectURL,
  type Order,
  type RedirectURL,
  renderPaymentWindow,
} from '@entities/payment';
import { detectExpiredToken } from '@shared/lib';

export const pay200SDK = ({ apiKey }: { apiKey: string }) => {
  const paymentApi = createPaymentApi({ apiKey });

  const requestPayment = async ({
    amount,
    orderId,
    orderName,
    successUrl,
  }: Order & RedirectURL) => {
    try {
      const { ok, data, error } = await paymentApi.requestPayment({
        amount,
        orderId,
        orderName,
      });

      if (!ok || !data) {
        throw error;
      }

      const { token, expiredAt } = data;

      const redirectURL = createRedirectURL({
        token,
        expiredAt,
      });

      const closePaymentWindow = await renderPaymentWindow(redirectURL);

      detectExpiredToken(expiredAt, closePaymentWindow);

      await paymentApi.subscribePaymentEvents({
        orderId,
        close: closePaymentWindow,
        successUrl,
      });
    } catch (error) {
      console.error('👀 [pay200SDK] error', error);
      throw error;
    }
  };

  return requestPayment;
};
