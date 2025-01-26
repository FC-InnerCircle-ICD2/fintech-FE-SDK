export const MOBILE_APP_PATH = {
  REDIRECT_URL: (token: string, expiredAt: string) =>
    `https://example.com/payments/detail?token=${token}&expiredAt=${expiredAt}`,
} as const;
