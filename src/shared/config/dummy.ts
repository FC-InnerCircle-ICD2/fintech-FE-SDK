export const DUMMY_API_CONFIG = {
  ORDER_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudF9uYW1lIjoiZGV2ZWxvcGVyIHNob3AiLCJvcmRlcl9uYW1lIjoibmV4dGpzIDEiLCJhbW91bnQiOjUwMDAwLCJpYXQiOjE1MTYyMzkwMjJ9.JFQ2zCTeF7y5Chq9c-p-vMyQ2wn_RyYX9dTxeI5cSxo',
  ORDER: {
    ID: '12345',
    AMOUNT: 10000,
    NAME: 'MacBook Pro M4',
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
