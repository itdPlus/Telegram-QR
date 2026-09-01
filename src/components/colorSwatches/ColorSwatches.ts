import {TELEGRAM_BRAND_BLUE} from '@/lib/qr/telegramQrStyle';
import type {ColorPresetId} from '@/core/types';
import styles from './colorSwatches.module.scss';

export interface ColorSwatchesOptions {
  value: ColorPresetId;
  customColor: string;
  onSelect: (preset: ColorPresetId) => void;
  onCustomColor: (hex: string) => void;
}

export function createColorSwatches(options: ColorSwatchesOptions): {
  root: HTMLDivElement;
  setValue: (value: ColorPresetId) => void;
} {
  const root = document.createElement('div');
  root.className = styles.swatches;

  const swatchElements = new Map<ColorPresetId, HTMLElement>();

  const applyActive = (value: ColorPresetId) => {
    for(const [presetId, element] of swatchElements) {
      element.classList.toggle(styles.swatchActive, presetId === value);
    }
  };

  const blueSwatch = document.createElement('button');
  blueSwatch.type = 'button';
  blueSwatch.className = styles.swatch;
  blueSwatch.style.backgroundColor = TELEGRAM_BRAND_BLUE;
  blueSwatch.addEventListener('click', () => {
    options.onSelect('blue');
    applyActive('blue');
  });

  const blackSwatch = document.createElement('button');
  blackSwatch.type = 'button';
  blackSwatch.className = styles.swatch;
  blackSwatch.style.backgroundColor = '#000000';
  blackSwatch.addEventListener('click', () => {
    options.onSelect('black');
    applyActive('black');
  });

  const customSwatch = document.createElement('div');
  customSwatch.className = `${styles.swatch} ${styles.custom}`;
  const customInput = document.createElement('input');
  customInput.type = 'color';
  customInput.className = styles.customInput;
  customInput.value = options.customColor;
  customInput.addEventListener('input', () => {
    options.onSelect('custom');
    options.onCustomColor(customInput.value);
    applyActive('custom');
  });
  customSwatch.appendChild(customInput);

  swatchElements.set('blue', blueSwatch);
  swatchElements.set('black', blackSwatch);
  swatchElements.set('custom', customSwatch);

  root.append(blueSwatch, blackSwatch, customSwatch);
  applyActive(options.value);

  return {
    root,
    setValue: applyActive
  };
}
