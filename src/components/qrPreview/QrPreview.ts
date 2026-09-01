import {TelegramQrRenderer} from '@/lib/qr/renderer';
import {resolveLook} from '@/lib/qr/resolveLook';
import {TELEGRAM_BRAND_BLUE} from '@/lib/qr/telegramQrStyle';
import {composeQrPng} from '@/lib/qr/exportPng';
import {composeQrSvg} from '@/lib/qr/exportSvg';
import {CARD_LAYOUT} from '@/lib/qr/cardLayout';
import {pickReadableInk} from '@/lib/color';
import {downloadBlob, buildQrFilename} from '@/lib/download';
import {createButton} from '@/components/button/Button';
import {createProfileCard, type ProfileCardHandle} from '@/components/profileCard/ProfileCard';
import {encodeLink} from '@/lib/encode/link';
import {encodeWifi} from '@/lib/encode/wifi';
import {encodeText} from '@/lib/encode/text';
import {encodeEvent} from '@/lib/encode/event';
import {encodeGeo} from '@/lib/encode/geo';
import type {Store} from '@/core/store';
import type {AppState, CategoryId} from '@/core/types';
import styles from './qrPreview.module.scss';

const LONG_DATA_THRESHOLD = 120;
const EXPORT_QR_SIZE = CARD_LAYOUT.qrSize;
const SCREEN_QR_SIZE = 220;

// The downloaded PNG/SVG bakes the QR into a card using CARD_LAYOUT's
// absolute pixel values. The on-screen preview renders the QR much smaller,
// so every surrounding measurement (card padding/radius, the gap before the
// label, the label pill itself) is derived from the same constants scaled
// down by this ratio — that's what keeps the preview's proportions an exact
// miniature of the exported file instead of drifting out of sync.
const PREVIEW_SCALE = SCREEN_QR_SIZE / CARD_LAYOUT.qrSize;
const PREVIEW_CARD_PADDING = CARD_LAYOUT.cardPadding * PREVIEW_SCALE;
const PREVIEW_CARD_RADIUS = CARD_LAYOUT.cardRadius * PREVIEW_SCALE;
const PREVIEW_LABEL_GAP = CARD_LAYOUT.labelGap * PREVIEW_SCALE;

// Scaling typography by the same linear ratio as the QR (≈0.34x) produces
// an unreadable ~8px label, even though the pill has plenty of room for
// something legible — screen text needs a readable floor independent of
// how far the surrounding geometry has been shrunk. The pill height is
// floored right alongside the font so it still hugs the text comfortably
// instead of leaving it cramped against a height computed for the tiny font.
const PREVIEW_LABEL_FONT_SIZE = Math.max(13, CARD_LAYOUT.labelFontSize * PREVIEW_SCALE);
const PREVIEW_LABEL_HEIGHT = Math.max(34, CARD_LAYOUT.labelHeight * PREVIEW_SCALE);

function encodeForCategory(state: AppState): string {
  switch(state.category) {
    case 'link': return encodeLink(state.link.url);
    case 'wifi': return encodeWifi(state.wifi);
    case 'text': return encodeText(state.text);
    case 'event': return encodeEvent(state.event);
    case 'geo': return encodeGeo(state.geo);
    default: return '';
  }
}

export function createQrPreview(store: Store<AppState>): HTMLElement {
  const panel = document.createElement('div');
  panel.className = styles.panel;

  const qrCard = document.createElement('div');
  qrCard.className = styles.card;
  qrCard.style.padding = `${PREVIEW_CARD_PADDING}px`;
  qrCard.style.borderRadius = `${PREVIEW_CARD_RADIUS}px`;
  qrCard.style.gap = `${PREVIEW_LABEL_GAP}px`;

  const qrHost = document.createElement('div');
  qrHost.className = styles.qrHost;
  qrHost.style.width = `${SCREEN_QR_SIZE}px`;
  qrHost.style.height = `${SCREEN_QR_SIZE}px`;

  const pill = document.createElement('div');
  pill.className = styles.pill;
  pill.style.backgroundColor = TELEGRAM_BRAND_BLUE;
  pill.style.color = pickReadableInk(TELEGRAM_BRAND_BLUE);
  pill.style.height = `${PREVIEW_LABEL_HEIGHT}px`;
  pill.style.borderRadius = `${PREVIEW_LABEL_HEIGHT / 2}px`;
  pill.style.fontSize = `${PREVIEW_LABEL_FONT_SIZE}px`;
  pill.style.width = `${SCREEN_QR_SIZE}px`;

  qrCard.append(qrHost, pill);

  const actions = document.createElement('div');
  actions.className = styles.actions;

  const warning = document.createElement('div');
  warning.className = styles.warning;
  warning.textContent = 'Слишком много данных — QR-код получится плотным и может хуже сканироваться';
  warning.style.display = 'none';

  panel.append(qrCard, actions, warning);

  const renderer = new TelegramQrRenderer(qrHost);
  let profileCardHandle: ProfileCardHandle | null = null;
  let currentCategory: CategoryId | null = null;

  const rebuildActions = (category: CategoryId) => {
    actions.innerHTML = '';

    if(category === 'profile') {
      const pngButton = createButton({
        variant: 'primary',
        label: 'Скачать PNG',
        icon: 'download',
        fullWidth: true,
        onClick: async() => {
          const blob = await profileCardHandle?.getBlob();
          if(blob) downloadBlob(blob, buildQrFilename('png'));
        }
      });
      pngButton.classList.add(styles.actionButton);
      actions.appendChild(pngButton);
      return;
    }

    const pngButton = createButton({
      variant: 'primary',
      label: 'PNG',
      icon: 'download',
      fullWidth: true,
      onClick: async() => {
        const state = store.get();
        const look = resolveLook(state.look);
        const data = encodeForCategory(state);
        if(!data) return;

        // Render at export resolution first so the exported raster QR is
        // crisp instead of the 220px preview upscaled and blurred to 640px.
        await renderer.render({
          data,
          size: EXPORT_QR_SIZE,
          dotColor: look.dotColor,
          logoMode: state.look.logoMode,
          customLogoDataUrl: state.look.customLogoDataUrl
        });
        const qrBlob = await renderer.getBlob('png');
        const composed = await composeQrPng({
          qrBlob,
          cardBackground: look.cardBackground,
          label: look.showLabel ? state.look.label : undefined,
          accentColor: TELEGRAM_BRAND_BLUE
        });
        downloadBlob(composed, buildQrFilename('png'));

        // Restore the on-screen preview resolution.
        await renderer.render({
          data,
          size: SCREEN_QR_SIZE,
          dotColor: look.dotColor,
          logoMode: state.look.logoMode,
          customLogoDataUrl: state.look.customLogoDataUrl
        });
      }
    });

    const svgButton = createButton({
      variant: 'secondary',
      label: 'SVG',
      icon: 'download',
      fullWidth: true,
      onClick: async() => {
        const state = store.get();
        const look = resolveLook(state.look);
        const qrBlob = await renderer.getBlob('svg');
        const composed = await composeQrSvg({
          qrBlob,
          cardBackground: look.cardBackground,
          label: look.showLabel ? state.look.label : undefined,
          accentColor: TELEGRAM_BRAND_BLUE
        });
        downloadBlob(composed, buildQrFilename('svg'));
      }
    });

    pngButton.classList.add(styles.actionButton);
    svgButton.classList.add(styles.actionButton);
    actions.append(pngButton, svgButton);
  };

  const render = () => {
    const state = store.get();

    if(state.category !== currentCategory) {
      currentCategory = state.category;
      qrCard.style.display = state.category === 'profile' ? 'none' : 'flex';

      if(state.category === 'profile') {
        if(!profileCardHandle) profileCardHandle = createProfileCard(store);
        if(!panel.contains(profileCardHandle.root)) panel.insertBefore(profileCardHandle.root, actions);
      } else if(profileCardHandle && panel.contains(profileCardHandle.root)) {
        profileCardHandle.root.remove();
      }

      rebuildActions(state.category);
    }

    if(state.category === 'profile') {
      profileCardHandle?.refresh();
      warning.style.display = 'none';
      return;
    }

    const data = encodeForCategory(state);
    const look = resolveLook(state.look);

    qrCard.style.backgroundColor = look.cardBackground;
    qrCard.classList.toggle(styles.cardFramed, look.framed);
    pill.style.display = look.showLabel ? '' : 'none';
    pill.textContent = state.look.label;

    if(data) {
      void renderer.render({
        data,
        size: SCREEN_QR_SIZE,
        dotColor: look.dotColor,
        logoMode: state.look.logoMode,
        customLogoDataUrl: state.look.customLogoDataUrl
      });
    } else {
      renderer.destroy();
    }

    warning.style.display = data.length > LONG_DATA_THRESHOLD ? '' : 'none';
  };

  store.subscribe(render);
  render();

  return panel;
}