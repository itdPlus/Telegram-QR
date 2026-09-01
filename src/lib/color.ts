export function hexToRgb(hex: string): {r: number; g: number; b: number} {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized.padEnd(6, '0').slice(0, 6);

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

export function relativeLuminance(hex: string): number {
  const {r, g, b} = hexToRgb(hex);
  const channel = (value: number) => {
    const c = value / 255;
    return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  };
  return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
}

export function pickReadableInk(backgroundHex: string): string {
  return relativeLuminance(backgroundHex) > .45 ? '#000000' : '#ffffff';
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Scales a color's RGB toward black in small steps until its relative
 * luminance drops to maxLuminance, so light wallpaper stops used as QR/text
 * ink stay scannable/readable against a white card.
 */
export function darkenToMaxLuminance(hex: string, maxLuminance: number): string {
  let {r, g, b} = hexToRgb(hex);
  let color = hex;
  let guard = 0;

  while(relativeLuminance(color) > maxLuminance && guard < 100) {
    r *= .92;
    g *= .92;
    b *= .92;
    color = rgbToHex(r, g, b);
    guard++;
  }

  return color;
}
