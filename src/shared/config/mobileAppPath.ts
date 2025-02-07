export const MOBILE_APP_PATH = {
  REDIRECT_URL: (token: string, expiredAt: string) =>
    `https://pay-200.vercel.app/payment/detail?token=${token}&expiredAt=${expiredAt}`,
} as const;
