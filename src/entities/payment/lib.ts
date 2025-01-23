import { MOBILE_APP_PATH } from '@shared/config';
import { PAYMENT_ERROR, PaymentError } from './error';
import type { PaymentRes } from './types';

export const createRedirectURL = ({ token, expiredAt }: PaymentRes): string => {
  if (!token || !expiredAt) {
    throw new PaymentError(
      PAYMENT_ERROR.INVALID_PARAMS,
      '결제 정보가 유효하지 않습니다.',
    );
  }

  const expirationDate = new Date(expiredAt);

  if (isNaN(expirationDate.getTime())) {
    throw new PaymentError(
      PAYMENT_ERROR.INVALID_DATE,
      '만료 시간 형식이 올바르지 않습니다.',
    );
  }

  if (new Date() >= expirationDate) {
    throw new PaymentError(
      PAYMENT_ERROR.EXPIRED,
      '결제 정보가 이미 만료되었습니다.',
    );
  }

  return MOBILE_APP_PATH.REDIRECT_URL(token, expiredAt);
};
