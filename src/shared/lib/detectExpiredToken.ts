import { compareServerTimestampByNow } from './compareTimestamp';

export const detectExpiredToken = (expiredAt: string, callback: () => void) => {
  const diff = compareServerTimestampByNow(expiredAt);

  const timeoutId = setTimeout(callback, diff);

  return () => clearTimeout(timeoutId);
};
