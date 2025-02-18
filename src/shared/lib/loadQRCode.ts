type QRCodeErrorCorrectionLevel =
  | 'low'
  | 'medium'
  | 'quartile'
  | 'high'
  | 'L'
  | 'M'
  | 'Q'
  | 'H';
type QRCodeMaskPattern = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type QRCodeToSJISFunc = (codePoint: string) => number;

interface QRCodeOptions {
  version?: number | undefined;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel | undefined;
  maskPattern?: QRCodeMaskPattern | undefined;
  toSJISFunc?: QRCodeToSJISFunc | undefined;
}

interface QRCodeRenderersOptions extends QRCodeOptions {
  margin?: number | undefined;
  scale?: number | undefined;
  width?: number | undefined;
  color?:
    | {
        dark?: string | undefined;
        light?: string | undefined;
      }
    | undefined;
}

interface QRCodeStatic {
  toCanvas(
    text: string,
    options: QRCodeRenderersOptions,
    callback: (
      error: Error | null | undefined,
      canvas: HTMLCanvasElement,
    ) => void,
  ): Promise<HTMLCanvasElement>;
}

declare global {
  interface Window {
    QRCode: QRCodeStatic;
  }
}

export const loadQRCode = async (): Promise<QRCodeStatic> => {
  if (window.QRCode) {
    return window.QRCode;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1/build/qrcode.min.js';
    script.onload = () => resolve(window.QRCode);
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};
