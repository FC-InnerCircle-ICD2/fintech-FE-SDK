export const openNewWindow = (
  width?: number,
  height?: number,
): Window | null => {
  const features = width && height ? `width=${width},height=${height}` : '';

  return window.open('about:blank', 'newWindow', features);
};

export const createShadowDOMRoot = (document: Document): ShadowRoot => {
  document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      </head>
      <body style="margin: 0; padding: 0; width: 100%; height: 100svh; overflow: hidden;"></body>
    </html>
  `);
  document.close();

  return document.body.attachShadow({ mode: 'open' });
};
