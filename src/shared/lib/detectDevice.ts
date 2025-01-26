const MOBILE_USER_AGENTS =
  /android|webos|iphone|ipad|ipod|blackberry|windows phone|iemobile|opera mini|mobile/i;

export const detectDevice = (): 'mobile' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const hasTouchSupport =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return MOBILE_USER_AGENTS.test(userAgent) || hasTouchSupport
    ? 'mobile'
    : 'desktop';
};
