import {
  PAYMENT_RENDER_ERROR,
  PaymentError,
  PaymentRenderError,
} from '@entities/payment/error';
import {
  createShadowDOMRoot,
  detectDevice,
  loadQRCode,
  openNewWindow,
} from '@shared/lib';

const createPaymentLayout = (shadowRoot: ShadowRoot, content: string) => {
  shadowRoot.innerHTML = `
    <div id="app" style="min-height: -webkit-fill-available; display: flex; flex-direction: column; align-self: stretch; align-items: center; padding: 1rem;">
      <header style=" align-self: stretch; height: 2rem; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_485_4970)">
            <path d="M24.135 28.7661H5.38525L22.4512 10.7837L21.2458 18.4198L16.0405 24.2064H24.135V28.7661Z" fill="#1D2087" />
            <path d="M20.7911 19.5825C24.7258 15.6967 25.7515 10.4096 23.0821 7.77338C20.4126 5.13714 15.0589 6.15009 11.1243 10.0359C7.18963 13.9216 6.16393 19.2087 8.83335 21.845C11.5028 24.4813 16.8564 23.4683 20.7911 19.5825Z" fill="#18A0FB" />
            <path d="M16.9004 16.0584C18.6409 14.3395 19.0945 12.0006 17.9136 10.8342C16.7326 9.66793 14.3642 10.1159 12.6236 11.8348C10.8831 13.5537 10.4295 15.8927 11.6105 17.059C12.7915 18.2253 15.1598 17.7773 16.9004 16.0584Z" fill="white" />
          </g>
        </svg>
      </header>
      <main style="display: flex; flex: 1 1 0; flex-direction: column; align-self: stretch; justify-content: center; align-items: center; gap: 1.5rem; padding: 1rem;">
        ${content}
      </main>
    </div>
  `;
};

const renderMobilePaymentWindow = async (url: string) => {
  const newWindow = openNewWindow();

  if (!newWindow) {
    throw new PaymentRenderError(PAYMENT_RENDER_ERROR.WINDOW_OPEN_FAILED);
  }

  try {
    const shadowRoot = createShadowDOMRoot(newWindow.document);

    createPaymentLayout(
      shadowRoot,
      `
<p style="margin: 0; width: 100%; text-align: center; color: black; font-size: 1.25rem; font-weight: 700;">
  Pay200으로 결제하려면<br /><span style="color: #1293fb">다음</span>  버튼을 눌러주세요.
</p>
<button id="pay200-next-button" style="appearance: none; border: none; padding: 0.75rem 5rem; background: #1293fb; color: white; font-size: 1.25rem; font-weight: 700; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); border-radius: 0.5rem; overflow: hidden; cursor: pointer;" aria-label="다음 단계로 이동">다음</button>
<p id="disabled" style="color: gray; font-size: 1rem"></p>
      `,
    );

    const button = shadowRoot.querySelector<HTMLButtonElement>(
      '#pay200-next-button',
    );

    if (!button || !shadowRoot.contains(button)) {
      throw new PaymentRenderError(PAYMENT_RENDER_ERROR.BUTTON_NOT_FOUND);
    }

    button.addEventListener('click', () => {
      newWindow.location.href = url;
    });

    const disabled =
      shadowRoot.querySelector<HTMLParagraphElement>('#disabled');

    if (!disabled || !shadowRoot.contains(disabled)) {
      throw new PaymentRenderError(PAYMENT_RENDER_ERROR.DISABLED_NOT_FOUND);
    }

    return () => {
      newWindow.close();
      button.disabled = true;
      disabled.textContent =
        'QR 코드가 만료되었어요. 결제를 다시 시도해주세요.';
    };
  } catch (error) {
    newWindow.close();
    throw new PaymentRenderError({
      ...PAYMENT_RENDER_ERROR.RENDER_FAILED,
      cause: error,
    });
  }
};

const renderDesktopPaymentWindow = async (url: string) => {
  const newWindow = openNewWindow(375, 500);

  if (!newWindow) {
    throw new PaymentRenderError(PAYMENT_RENDER_ERROR.WINDOW_OPEN_FAILED);
  }

  try {
    const shadowRoot = createShadowDOMRoot(newWindow.document);

    createPaymentLayout(
      shadowRoot,
      `
<div style="align-self: stretch; display: inline-flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.5rem; text-align: center; color: black;">
  <p style="margin: 0; width: 100%; font-size: 1.25rem; font-weight: 700">Pay200으로 결제하려면<br /><span style="color: #1293fb">QR코드</span>를 스캔해주세요.</p>
  <p style="margin: 0; width: 100%; color: rgba(0, 0, 0, 0.5); font-size: 0.75rem;">Pay200 앱이나 기본 카메라를 사용해주세요.</p>
</div>
<div id="pay200-qrcode" style="display: flex; align-self: stretch; justify-content: center; align-items: center;"></div>
      `,
    );

    const container = shadowRoot.querySelector('#pay200-qrcode');

    if (!container || !shadowRoot.contains(container)) {
      throw new PaymentRenderError(
        PAYMENT_RENDER_ERROR.QR_CODE_CONTAINER_NOT_FOUND,
      );
    }

    const QRCode = await loadQRCode();

    QRCode.toCanvas(
      url,
      { errorCorrectionLevel: 'M', width: 240 },
      (error, canvas) => {
        if (error) {
          throw new PaymentRenderError(
            PAYMENT_RENDER_ERROR.QR_CODE_RENDER_FAILED,
          );
        }

        container.appendChild(canvas);
      },
    );

    const canvas = shadowRoot.querySelector('div#pay200-qrcode>canvas');

    if (!canvas || !shadowRoot.contains(canvas)) {
      throw new PaymentRenderError(PAYMENT_RENDER_ERROR.QR_CODE_RENDER_FAILED);
    }

    return () => newWindow.close();
  } catch (error) {
    newWindow.close();
    throw new PaymentRenderError({
      ...PAYMENT_RENDER_ERROR.RENDER_FAILED,
      cause: error,
    });
  }
};

export const renderPaymentWindow = async (url: string) => {
  try {
    const device = detectDevice();

    const renderer =
      device === 'mobile'
        ? renderMobilePaymentWindow
        : renderDesktopPaymentWindow;

    return await renderer(url);
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }

    throw new PaymentRenderError({
      ...PAYMENT_RENDER_ERROR.RENDER_FAILED,
      cause: error,
    });
  }
};
