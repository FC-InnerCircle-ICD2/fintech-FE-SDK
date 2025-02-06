export const MOBILE_APP_PATH = {
  REDIRECT_URL: (token: string, expiredAt: string) =>
    `https://pay-200.vercel.app/payments/detail?token=${token}&expiredAt=${expiredAt}`,
} as const;
