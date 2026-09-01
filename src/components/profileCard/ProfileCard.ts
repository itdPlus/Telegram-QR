import {TelegramQrRenderer} from '@/lib/qr/renderer';
import {roundRectPath} from '@/lib/qr/roundRect';
import {darkenToMaxLuminance} from '@/lib/color';
import {getWallpaperPreset, getWallpaperStops} from '@/lib/wallpapers';
import {encodeProfile} from '@/lib/encode/profile';
import type {Store} from '@/core/store';
import type {AppState} from '@/core/types';
import styles from './profileCard.module.scss';

const CARD_W = 300;
const CARD_H = 330;
const CARD_R = 42;
const AVATAR_SIZE = 100;
const AVATAR_R = AVATAR_SIZE / 2;
const AVATAR_RING = 4;
const AVATAR_OVERHANG = 70;
const QR_SIZE = 220;

const CANVAS_W = CARD_W + 76;
const TOP_PAD = 40;
const BOTTOM_PAD = 32;
const CARD_Y = TOP_PAD + AVATAR_OVERHANG;
const CANVAS_H = CARD_Y + CARD_H + BOTTOM_PAD;
const CARD_X = (CANVAS_W - CARD_W) / 2;
const AVATAR_CX = CANVAS_W / 2;
const AVATAR_CY = CARD_Y - AVATAR_OVERHANG + AVATAR_R;
const QR_X = (CANVAS_W - QR_SIZE) / 2;
const QR_Y = CARD_Y + 50;
const USERNAME_Y = QR_Y + QR_SIZE + 20;

const QR_INK_MAX_LUMINANCE = 0.18;
const USERNAME_FONT_FAMILY = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

const darkenStops = (stops: string[]): string[] => {
  return stops.map((stop) => darkenToMaxLuminance(stop, QR_INK_MAX_LUMINANCE));
};

const gradientFill = (
  ctx: CanvasRenderingContext2D,
  stops: string[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  fallback: string
): string | CanvasGradient => {
  if(stops.length < 2) return stops[0] ?? fallback;
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((stop, index) => gradient.addColorStop(index / (stops.length - 1), stop));
  return gradient;
};

function composeQrWithGradient(qrCanvas: HTMLCanvasElement, stops: string[]): HTMLCanvasElement {
  const masked = document.createElement('canvas');
  masked.width = qrCanvas.width;
  masked.height = qrCanvas.height;
  const mctx = masked.getContext('2d');
  if(!mctx) return qrCanvas;

  const dark = darkenStops(stops);
  mctx.fillStyle = gradientFill(mctx, dark, 0, 0, masked.width, masked.height, '#000000');
  mctx.fillRect(0, 0, masked.width, masked.height);
  mctx.globalCompositeOperation = 'destination-in';
  mctx.drawImage(qrCanvas, 0, 0);
  return masked;
}

function drawWallpaper(ctx: CanvasRenderingContext2D, stops: string[]): void {
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
  stops.forEach((stop, index) => gradient.addColorStop(index / Math.max(stops.length - 1, 1), stop));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawCard(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  roundRectPath(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_R);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

function drawAvatarRing(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R + AVATAR_RING, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAvatarPhoto(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R, 0, Math.PI * 2);
  ctx.clip();

  const srcAspect = image.naturalWidth / image.naturalHeight;
  let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
  if(srcAspect > 1) {
    sw = image.naturalHeight;
    sx = (image.naturalWidth - sw) / 2;
  } else if(srcAspect < 1) {
    sh = image.naturalWidth;
    sy = (image.naturalHeight - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, AVATAR_CX - AVATAR_R, AVATAR_CY - AVATAR_R, AVATAR_R * 2, AVATAR_R * 2);
  ctx.restore();
}

function drawAvatarFallback(ctx: CanvasRenderingContext2D, name: string): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R, 0, Math.PI * 2);
  ctx.clip();

  const gradient = ctx.createLinearGradient(
    AVATAR_CX - AVATAR_R, AVATAR_CY - AVATAR_R,
    AVATAR_CX + AVATAR_R, AVATAR_CY + AVATAR_R
  );
  gradient.addColorStop(0, '#7ec8e3');
  gradient.addColorStop(1, '#3390ec');
  ctx.fillStyle = gradient;
  ctx.fillRect(AVATAR_CX - AVATAR_R, AVATAR_CY - AVATAR_R, AVATAR_R * 2, AVATAR_R * 2);

  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 ${AVATAR_R}px ${USERNAME_FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, AVATAR_CX, AVATAR_CY + 2);
  ctx.restore();
}

const USERNAME_MIN_FONT = 12;

function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): number {
  let size = 22;
  while(size > USERNAME_MIN_FONT) {
    ctx.font = `600 ${size}px ${USERNAME_FONT_FAMILY}`;
    if(ctx.measureText(text).width <= maxWidth) return size;
    size--;
  }
  ctx.font = `600 ${USERNAME_MIN_FONT}px ${USERNAME_FONT_FAMILY}`;
  return USERNAME_MIN_FONT;
}

function drawUsername(ctx: CanvasRenderingContext2D, text: string, stops: string[]): void {
  if(!text) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const maxWidth = CARD_W - 48;
  const size = fitFontSize(ctx, text, maxWidth);
  const width = Math.min(ctx.measureText(text).width, maxWidth);
  const dark = darkenStops(stops);
  ctx.fillStyle = gradientFill(
    ctx, dark,
    AVATAR_CX - width / 2, USERNAME_Y,
    AVATAR_CX + width / 2, USERNAME_Y + size,
    '#000000'
  );
  ctx.fillText(text, AVATAR_CX, USERNAME_Y);
  ctx.restore();
}

const avatarImageCache = new Map<string, HTMLImageElement>();

function loadAvatarImage(src: string): Promise<HTMLImageElement> {
  const cached = avatarImageCache.get(src);
  if(cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      avatarImageCache.set(src, image);
      resolve(image);
    };
    image.onerror = reject;
    image.src = src;
  });
}

export interface ProfileCardHandle {
  root: HTMLElement;
  refresh: () => void;
  getBlob: () => Promise<Blob | undefined>;
  destroy: () => void;
}

export function createProfileCard(store: Store<AppState>): ProfileCardHandle {
  const wrapper = document.createElement('div');
  wrapper.className = styles.wrapper;

  const canvas = document.createElement('canvas');
  canvas.className = styles.canvas;
  wrapper.appendChild(canvas);

  const qrHost = document.createElement('div');
  qrHost.style.position = 'absolute';
  qrHost.style.left = '-9999px';
  qrHost.style.width = '0';
  qrHost.style.height = '0';
  qrHost.style.overflow = 'hidden';
  document.body.appendChild(qrHost);
  const qrRenderer = new TelegramQrRenderer(qrHost);

  let generation = 0;

  const paint = async(): Promise<void> => {
    const myGeneration = ++generation;
    const state = store.get().profile;
    const preset = getWallpaperPreset(state.wallpaperId);
    const stops = getWallpaperStops(preset, state.nightMode);
    const dpr = Math.min(3, Math.max(2, window.devicePixelRatio || 2));

    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;

    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    drawWallpaper(ctx, stops);
    drawCard(ctx);
    drawAvatarRing(ctx);

    if(state.avatarDataUrl) {
      try {
        const image = await loadAvatarImage(state.avatarDataUrl);
        if(myGeneration !== generation) return;
        drawAvatarPhoto(ctx, image);
      } catch{
        drawAvatarFallback(ctx, state.displayName || state.username || '?');
      }
    } else {
      drawAvatarFallback(ctx, state.displayName || state.username || '?');
    }

    const profileUrl = encodeProfile(state);
    if(profileUrl) {
      await qrRenderer.render({
        data: profileUrl,
        size: QR_SIZE * 3,
        dotColor: '#000000',
        logoMode: 'none'
      });
      if(myGeneration !== generation) return;

      const qrCanvas = qrHost.querySelector('canvas');
      if(qrCanvas) {
        const tinted = composeQrWithGradient(qrCanvas, stops);
        ctx.drawImage(tinted, QR_X, QR_Y, QR_SIZE, QR_SIZE);
      }
    }

    const usernameText = state.username
      ? `@${state.username.trim().replace(/^@/, '').toUpperCase()}`
      : (state.displayName || '');
    drawUsername(ctx, usernameText, stops);
  };

  return {
    root: wrapper,
    refresh: () => {
      void paint();
    },
    getBlob: () => {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/png');
      });
    },
    destroy: () => {
      generation++;
      qrRenderer.destroy();
      qrHost.remove();
    }
  };
}
