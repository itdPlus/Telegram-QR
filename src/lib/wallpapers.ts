export interface WallpaperPreset {
  id: string;
  name: string;
  day: string[];
  night: string[];
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'classic',
    name: 'Telegram',
    day: ['#dbddbb', '#6ba587', '#d5d88d', '#88b884'],
    night: ['#485563', '#29323c', '#3a4552', '#232a30']
  },
  {
    id: 'blue',
    name: 'Синий',
    day: ['#7ec8e3', '#3390ec', '#5aa9e6', '#2b7bc9'],
    night: ['#1b3a57', '#0f2438', '#16324a', '#0a1a28']
  },
  {
    id: 'sunset',
    name: 'Закат',
    day: ['#fbc687', '#f7a072', '#f68989', '#e46e6e'],
    night: ['#4a2c3d', '#2e1a2c', '#3d2436', '#1f1220']
  },
  {
    id: 'violet',
    name: 'Фиолетовый',
    day: ['#c9a7eb', '#9b7fd4', '#8774e1', '#6a5acd'],
    night: ['#332452', '#211636', '#2b1e46', '#180f28']
  },
  {
    id: 'green',
    name: 'Зелёный',
    day: ['#bde6b8', '#8fd694', '#70b768', '#559b53'],
    night: ['#1f3a24', '#122318', '#1a301f', '#0c1a10']
  },
  {
    id: 'mono',
    name: 'Монохром',
    day: ['#ffffff', '#e4e6eb', '#d3d6db', '#c4c9cc'],
    night: ['#2b2b2b', '#1c1c1c', '#242424', '#141414']
  }
];

export function getWallpaperPreset(id: string): WallpaperPreset {
  return WALLPAPER_PRESETS.find((preset) => preset.id === id) ?? WALLPAPER_PRESETS[0];
}

export function getWallpaperStops(preset: WallpaperPreset, isNight: boolean): string[] {
  return isNight ? preset.night : preset.day;
}
