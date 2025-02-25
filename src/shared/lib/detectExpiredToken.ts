import { compareServerTimestampByNow } from './compareTimestamp';

export const detectExpiredToken = (expiredAt: string, callback: () => void) => {
  const diff = compareServerTimestampByNow(expiredAt);

  if (diff <= 0) {
    callback();
    return () => {};
  }

  const timeoutId = setTimeout(callback, diff);

  return () => clearTimeout(timeoutId);
};
