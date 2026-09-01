import {roundRectPath} from './roundRect';
import {pickReadableInk} from '@/lib/color';
import {CARD_LAYOUT, LABEL_FONT_FAMILY} from './cardLayout';

const {qrSize: QR_SIZE, cardPadding: CARD_PADDING, cardRadius: CARD_RADIUS, labelGap: LABEL_GAP, labelHeight: LABEL_HEIGHT} = CARD_LAYOUT;
const LABEL_FONT = `${CARD_LAYOUT.labelFontWeight} ${CARD_LAYOUT.labelFontSize}px ${LABEL_FONT_FAMILY}`;

export interface ComposePngOptions {
  qrBlob: Blob;
  cardBackground: string;
  label?: string;
  accentColor: string;
}

export async function composeQrPng(options: ComposePngOptions): Promise<Blob> {
  const image = await createImageBitmap(options.qrBlob);
  const hasLabel = !!options.label;
  const labelBlockHeight = hasLabel ? LABEL_GAP + LABEL_HEIGHT : 0;

  const width = QR_SIZE + CARD_PADDING * 2;
  const height = QR_SIZE + CARD_PADDING * 2 + labelBlockHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if(!ctx) throw new Error('Canvas is not supported');

  roundRectPath(ctx, 0, 0, width, height, CARD_RADIUS);
  ctx.fillStyle = options.cardBackground;
  ctx.fill();

  ctx.drawImage(image, CARD_PADDING, CARD_PADDING, QR_SIZE, QR_SIZE);

  if(hasLabel && options.label) {
    const pillY = CARD_PADDING + QR_SIZE + LABEL_GAP;
    const pillWidth = width - CARD_PADDING * 2;

    roundRectPath(ctx, CARD_PADDING, pillY, pillWidth, LABEL_HEIGHT, LABEL_HEIGHT / 2);
    ctx.fillStyle = options.accentColor;
    ctx.fill();

    ctx.fillStyle = pickReadableInk(options.accentColor);
    ctx.font = LABEL_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.label, width / 2, pillY + LABEL_HEIGHT / 2 + 1);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if(blob) resolve(blob);
      else reject(new Error('Failed to encode PNG'));
    }, 'image/png');
  });
}
