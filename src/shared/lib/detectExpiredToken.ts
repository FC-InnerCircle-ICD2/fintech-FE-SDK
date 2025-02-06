export const detectExpiredToken = (expiredAt: string, callback: () => void) => {
  const diff = new Date(expiredAt).getTime() - Date.now();
  const timeoutId = setTimeout(callback, diff);
  return () => clearTimeout(timeoutId);
};
