import { MOBILE_APP_PATH } from '@shared/config';
import { compareServerTimestampByNow, detectDevice } from '@shared/lib';
import { PAYMENT_ERROR, PaymentError } from './error';
import type { RequestPaymentRes } from './types';

export const createRedirectURL = ({
  token,
  expiredAt,
}: RequestPaymentRes): string => {
  if (!token || !expiredAt) {
    throw new PaymentError(PAYMENT_ERROR.INVALID_PARAMS);
  }

  const expiredAtDate = new Date(expiredAt + 'Z');

  if (isNaN(expiredAtDate.getTime())) {
    throw new PaymentError({
      name: PAYMENT_ERROR.INVALID_DATE.name,
      message: `${PAYMENT_ERROR.INVALID_DATE.message}: ${expiredAt}`,
    });
  }

  const isExpired = compareServerTimestampByNow(expiredAt) < 0;

  if (isExpired) {
    throw new PaymentError(PAYMENT_ERROR.EXPIRED);
  }

  const url =
    detectDevice() === 'mobile'
      ? MOBILE_APP_PATH.REDIRECT_URL.MOBILE
      : MOBILE_APP_PATH.REDIRECT_URL.DESKTOP;

  return addTokenAndExpiredAt(url, {
    token,
    expiredAt,
  });
};

const addTokenAndExpiredAt = (
  url: string,
  { token, expiredAt }: { token: string; expiredAt: string },
) => `${url}?token=${token}&expiredAt=${expiredAt}`;
