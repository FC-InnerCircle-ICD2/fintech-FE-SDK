export const DUMMY_API_CONFIG = {
  ORDER_TOKEN: 'HWgwrj5nn0WFyFGtSoANf0LAt30goF6TNqGjrVeVEsc=',
  ORDER: {
    ID: '12345',
    AMOUNT: 10000,
    SUCCESS_URL: 'https://example.com/success',
  },
  PAYMENT_EVENTS: {
    METHOD: 'PAYMENT_METHOD',
    RESULT: 'PAYMENT_RESULT',
    DATA: {
      METHOD: {
        SUCCESS: `https://example.com/success?id=${'12345'}&amount=${10000}`,
        FAILURE: `https://example.com/failure?id=${'12345'}`,
      },
      RESULT: {
        SUCCESS: 'PAYMENT_SUCCESS',
        FAILURE: 'PAYMENT_FAILURE',
      },
    },
  },
} as const;
