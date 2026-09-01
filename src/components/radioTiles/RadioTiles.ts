import styles from './radioTiles.module.scss';

export interface RadioTileOption<T extends string> {
  value: T;
  label: string;
  previewModifier?: 'plain' | 'framed' | 'background';
}

export interface RadioTilesOptions<T extends string> {
  options: RadioTileOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const previewModifierClass: Record<string, string | undefined> = {
  framed: styles.previewFramed,
  background: styles.previewBackground
};

export function createRadioTiles<T extends string>(options: RadioTilesOptions<T>): {
  root: HTMLDivElement;
  setValue: (value: T) => void;
} {
  const root = document.createElement('div');
  root.className = styles.tiles;

  const tileElements = new Map<T, HTMLButtonElement>();

  const applyActive = (value: T) => {
    for(const [tileValue, tile] of tileElements) {
      tile.classList.toggle(styles.tileActive, tileValue === value);
    }
  };

  for(const option of options.options) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = styles.tile;

    const preview = document.createElement('span');
    const modifierClass = previewModifierClass[option.previewModifier ?? 'plain'];
    preview.className = modifierClass ? `${styles.preview} ${modifierClass}` : styles.preview;
    const dot = document.createElement('span');
    dot.className = styles.previewDot;
    preview.appendChild(dot);

    const label = document.createElement('span');
    label.className = styles.label;
    label.textContent = option.label;

    tile.append(preview, label);
    tile.addEventListener('click', () => {
      options.onChange(option.value);
      applyActive(option.value);
    });

    tileElements.set(option.value, tile);
    root.appendChild(tile);
  }

  applyActive(options.value);

  return {
    root,
    setValue: applyActive
  };
}
