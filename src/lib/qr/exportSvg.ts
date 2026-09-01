import {pickReadableInk} from '@/lib/color';
import {CARD_LAYOUT, LABEL_FONT_FAMILY} from './cardLayout';

const {qrSize: QR_SIZE, cardPadding: CARD_PADDING, cardRadius: CARD_RADIUS, labelGap: LABEL_GAP, labelHeight: LABEL_HEIGHT} = CARD_LAYOUT;

export interface ComposeSvgOptions {
  qrBlob: Blob;
  cardBackground: string;
  label?: string;
  accentColor: string;
}

const escapeXml = (value: string): string => {
  return value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
};

export async function composeQrSvg(options: ComposeSvgOptions): Promise<Blob> {
  const svgText = await options.qrBlob.text();
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const inner = parsed.documentElement;

  const innerWidth = parseFloat(inner.getAttribute('width') || String(QR_SIZE));
  const scale = innerWidth > 0 ? QR_SIZE / innerWidth : 1;
  const serializer = new XMLSerializer();
  const innerMarkup = Array.from(inner.childNodes)
  .map((node) => serializer.serializeToString(node))
  .join('');

  const hasLabel = !!options.label;
  const labelBlockHeight = hasLabel ? LABEL_GAP + LABEL_HEIGHT : 0;
  const width = QR_SIZE + CARD_PADDING * 2;
  const height = QR_SIZE + CARD_PADDING * 2 + labelBlockHeight;
  const pillWidth = width - CARD_PADDING * 2;
  const pillY = CARD_PADDING + QR_SIZE + LABEL_GAP;

  const labelMarkup = hasLabel
    ? `<rect x="${CARD_PADDING}" y="${pillY}" width="${pillWidth}" height="${LABEL_HEIGHT}" rx="${LABEL_HEIGHT / 2}" fill="${options.accentColor}" />` +
      `<text x="${width / 2}" y="${pillY + LABEL_HEIGHT / 2}" fill="${pickReadableInk(options.accentColor)}" ` +
      `font-family="${LABEL_FONT_FAMILY}" font-size="${CARD_LAYOUT.labelFontSize}" font-weight="${CARD_LAYOUT.labelFontWeight}" ` +
      `text-anchor="middle" dominant-baseline="central">${escapeXml(options.label ?? '')}</text>`
    : '';

  const svg = '<?xml version="1.0" standalone="no"?>\r\n' +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect x="0" y="0" width="${width}" height="${height}" rx="${CARD_RADIUS}" fill="${options.cardBackground}" />` +
    `<g transform="translate(${CARD_PADDING}, ${CARD_PADDING}) scale(${scale})">${innerMarkup}</g>` +
    labelMarkup +
    '</svg>';

  return new Blob([svg], {type: 'image/svg+xml'});
}
