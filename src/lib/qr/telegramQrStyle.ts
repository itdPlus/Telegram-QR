export const TELEGRAM_QR_GEOMETRY = {
  dotsType: 'rounded' as const,
  cornersSquareType: 'extra-rounded' as const,
  cornersDotType: 'extra-rounded' as const,
  imageSize: 1,
  imageMargin: 0,
  errorCorrectionLevel: 'L' as const
};

export const TELEGRAM_BRAND_BLUE = '#3390ec';

const logoUrlCache = new Map<string, Promise<string>>();

export async function getTelegramLogoDataUrl(tintColor: string): Promise<string> {
  const cached = logoUrlCache.get(tintColor);
  if(cached) return cached;

  const promise = fetch('/telegram-logo-padded.svg')
  .then((res) => res.text())
  .then((markup) => {
    const tinted = markup.replace(/fill:#3390ec;/, `fill:${tintColor};`);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(tinted)))}`;
  });

  logoUrlCache.set(tintColor, promise);
  return promise;
}
