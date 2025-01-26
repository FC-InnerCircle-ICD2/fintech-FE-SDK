import { MOBILE_APP_PATH } from '@shared/config';
import { PAYMENT_ERROR, PaymentError } from './error';
import type { PaymentRes } from './types';

export const createRedirectURL = ({ token, expiredAt }: PaymentRes): string => {
  if (!token || !expiredAt) {
    throw new PaymentError(PAYMENT_ERROR.INVALID_PARAMS);
  }

  const expirationDate = new Date(expiredAt);

  if (isNaN(expirationDate.getTime())) {
    throw new PaymentError({
      name: PAYMENT_ERROR.INVALID_DATE.name,
      message: `${PAYMENT_ERROR.INVALID_DATE.message}: ${expiredAt}`,
    });
  }

  if (Date.now() >= expirationDate.getTime()) {
    throw new PaymentError(PAYMENT_ERROR.EXPIRED);
  }

  return MOBILE_APP_PATH.REDIRECT_URL(token, expiredAt);
};
