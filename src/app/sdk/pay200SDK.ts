import {
  createPaymentApi,
  createRedirectURL,
  type Order,
  type RedirectURL,
  renderPaymentWindow,
  PaymentError,
  PAYMENT_ERROR,
  type EventSourceHandler,
} from '@entities/payment';
import { detectExpiredToken } from '@shared/lib';

export const pay200SDK = ({ apiKey }: { apiKey: string }) => {
  const paymentApi = createPaymentApi({ apiKey });

  const requestPayment = async ({
    amount,
    orderId,
    orderName,
    successUrl,
    failUrl,
  }: Order & RedirectURL) => {
    try {
      if (!amount || !orderId || !orderName || !successUrl || !failUrl) {
        throw new PaymentError({
          name: PAYMENT_ERROR.INVALID_PARAMS.name,
          message: PAYMENT_ERROR.INVALID_PARAMS.message,
        });
      }

      if (amount <= 0) {
        throw new PaymentError({
          name: PAYMENT_ERROR.INVALID_AMOUNT.name,
          message: PAYMENT_ERROR.INVALID_AMOUNT.message,
        });
      }

      if (!successUrl.includes(window.location.origin)) {
        throw new PaymentError({
          name: PAYMENT_ERROR.INVALID_SUCCESS_URL.name,
          message: PAYMENT_ERROR.INVALID_SUCCESS_URL.message,
        });
      }

      if (!failUrl.includes(window.location.origin)) {
        throw new PaymentError({
          name: PAYMENT_ERROR.INVALID_FAIL_URL.name,
          message: PAYMENT_ERROR.INVALID_FAIL_URL.message,
        });
      }

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

      const paymentSession = {
        sseConnection: null as EventSourceHandler | null,
        isExpired: false,
      };

      const handleExpiration = () => {
        console.log('토큰이 만료되었습니다. 결제 창과 SSE 연결을 종료합니다.');
        closePaymentWindow();

        if (paymentSession.sseConnection) {
          paymentSession.sseConnection.close();
          paymentSession.sseConnection = null;
        }

        paymentSession.isExpired = true;
      };

      const clearExpiredTokenTimeout = detectExpiredToken(
        expiredAt,
        handleExpiration,
      );

      const wrappedClosePaymentWindow = () => {
        closePaymentWindow();
        clearExpiredTokenTimeout();

        if (paymentSession.sseConnection && !paymentSession.isExpired) {
          paymentSession.sseConnection.close();
          paymentSession.sseConnection = null;
        }
      };

      const sseConnection = await paymentApi.subscribePaymentEvents({
        orderId,
        close: wrappedClosePaymentWindow,
        successUrl,
        failUrl,
      });

      paymentSession.sseConnection = sseConnection;
    } catch (error) {
      console.error('👀 [pay200SDK] error', error);
      throw error;
    }
  };

  return requestPayment;
};
