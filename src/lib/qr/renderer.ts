import QRCodeStyling from 'qr-code-styling';
import {TELEGRAM_QR_GEOMETRY, getTelegramLogoDataUrl} from './telegramQrStyle';

export type LogoMode = 'telegram' | 'none' | 'custom';

export interface TelegramQrOptions {
  data: string;
  size: number;
  dotColor: string;
  logoMode: LogoMode;
  customLogoDataUrl?: string;
}

/**
 * qr-code-styling's bundled QR encoder builds "Byte" mode payloads by taking
 * each JS string char code and masking it with & 255. That silently truncates
 * any character above U+00FF (the entire Cyrillic range), corrupting the
 * payload. Pre-encoding the string as UTF-8 and representing every UTF-8 byte
 * as its own char code (0-255) makes that truncation a no-op, so the library
 * emits the correct UTF-8 byte stream — which is what virtually every modern
 * QR scanner assumes for Byte-mode content.
 */
function toQrSafeUtf8(value: string): string {
  return unescape(encodeURIComponent(value));
}

async function resolveLogo(options: TelegramQrOptions): Promise<string | undefined> {
  if(options.logoMode === 'none') return undefined;
  if(options.logoMode === 'custom') return options.customLogoDataUrl?.trim() || undefined;
  return getTelegramLogoDataUrl(options.dotColor);
}

async function buildOptions(options: TelegramQrOptions) {
  const logo = await resolveLogo(options);
  const margin = Math.max(10, Math.round(options.size * 0.08));

  return {
    width: options.size,
    height: options.size,
    data: toQrSafeUtf8(options.data),
    margin,
    dotsOptions: {
      color: options.dotColor,
      type: TELEGRAM_QR_GEOMETRY.dotsType
    },
    cornersSquareOptions: {
      type: TELEGRAM_QR_GEOMETRY.cornersSquareType,
      color: options.dotColor
    },
    cornersDotOptions: {
      type: TELEGRAM_QR_GEOMETRY.cornersDotType,
      color: options.dotColor
    },
    backgroundOptions: {
      color: 'rgba(0,0,0,0)'
    },
    qrOptions: {
      errorCorrectionLevel: TELEGRAM_QR_GEOMETRY.errorCorrectionLevel,
      mode: 'Byte' as const
    },
    // `image` and `imageOptions` are always included (never conditionally
    // spread), even as `undefined`. QRCodeStyling.update() deep-merges the
    // new options object into the previous one and never deletes a key that
    // is simply absent from the new object — so if we only sent `image`
    // when a logo was chosen, switching to "no logo" (or to a different
    // logo) would silently keep whatever image was set on a prior render.
    // Explicitly setting `image: undefined` forces the merge to actually
    // overwrite/clear it.
    image: logo,
    imageOptions: {
      imageSize: TELEGRAM_QR_GEOMETRY.imageSize,
      margin: TELEGRAM_QR_GEOMETRY.imageMargin,
      crossOrigin: 'anonymous' as const
    }
  };
}

export class TelegramQrRenderer {
  private instance: QRCodeStyling | undefined;
  private generation = 0;

  constructor(private host: HTMLElement) {}

  async render(options: TelegramQrOptions): Promise<void> {
    const generation = ++this.generation;
    const built = await buildOptions(options);
    if(generation !== this.generation) return;

    if(!this.instance) {
      this.host.innerHTML = '';
      this.instance = new QRCodeStyling(built);
      this.instance.append(this.host);
    } else {
      this.instance.update(built);
    }

    // The library draws the canvas/SVG asynchronously and does not expose
    // that promise directly. getRawData() internally awaits the same
    // drawing promise before resolving, so calling (and discarding) it here
    // guarantees the host's <canvas> actually has pixels by the time this
    // method returns — otherwise callers that read the canvas synchronously
    // (e.g. to composite it elsewhere) can grab a still-blank canvas.
    if(!built.data) return;
    try {
      await this.instance.getRawData('png');
    } catch{
      // ignore: a failed pre-warm shouldn't break the visible render
    }
    if(generation !== this.generation) return;
  }

  async getBlob(extension: 'png' | 'svg'): Promise<Blob> {
    if(!this.instance) throw new Error('QR is not rendered yet');
    const raw = await this.instance.getRawData(extension);
    if(!raw) throw new Error('Failed to export QR code');
    return raw instanceof Blob ? raw : new Blob([raw as BlobPart]);
  }

  destroy(): void {
    this.host.innerHTML = '';
    this.instance = undefined;
  }
}

