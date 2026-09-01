import type {LookState} from '@/core/types';
import {TELEGRAM_BRAND_BLUE} from './telegramQrStyle';
import {pickReadableInk} from '@/lib/color';

export interface ResolvedLook {
  cardBackground: string;
  dotColor: string;
  showLabel: boolean;
  framed: boolean;
}

export function resolveLook(look: LookState): ResolvedLook {
  const showLabel = look.type !== 'plain' && look.label.trim().length > 0;
  const framed = look.type === 'framed';

  if(look.type === 'background') {
    const cardBackground = look.colorPreset === 'custom'
      ? look.customBackground
      : look.colorPreset === 'black' ? '#000000' : TELEGRAM_BRAND_BLUE;

    return {
      cardBackground,
      dotColor: pickReadableInk(cardBackground),
      showLabel,
      framed: false
    };
  }

  const dotColor = look.colorPreset === 'custom'
    ? look.customForeground
    : look.colorPreset === 'black' ? '#000000' : TELEGRAM_BRAND_BLUE;

  return {
    cardBackground: '#ffffff',
    dotColor,
    showLabel,
    framed
  };
}
