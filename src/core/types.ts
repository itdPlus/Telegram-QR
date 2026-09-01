export type CategoryId = 'profile' | 'link' | 'wifi' | 'text' | 'event' | 'geo';

export type LookType = 'plain' | 'framed' | 'background';
export type ColorPresetId = 'blue' | 'black' | 'custom';
export type LogoMode = 'telegram' | 'none' | 'custom';

export interface LookState {
  type: LookType;
  colorPreset: ColorPresetId;
  customForeground: string;
  customBackground: string;
  label: string;
  logoMode: LogoMode;
  customLogoDataUrl: string;
  customLogoName: string;
}

export interface LinkState {
  url: string;
}

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiState {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export interface TextState {
  text: string;
}

export interface EventState {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface GeoState {
  lat: string;
  lng: string;
}

export interface ProfileState {
  username: string;
  displayName: string;
  avatarDataUrl: string;
  wallpaperId: string;
  nightMode: boolean;
}

export interface AppState {
  category: CategoryId;
  look: LookState;
  link: LinkState;
  wifi: WifiState;
  text: TextState;
  event: EventState;
  geo: GeoState;
  profile: ProfileState;
}

export const createInitialState = (): AppState => ({
  category: 'profile',
  look: {
    type: 'plain',
    colorPreset: 'blue',
    customForeground: '#3390ec',
    customBackground: '#ffffff',
    label: '',
    logoMode: 'telegram',
    customLogoDataUrl: '',
    customLogoName: ''
  },
  link: {
    url: ''
  },
  wifi: {
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  },
  text: {
    text: ''
  },
  event: {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  },
  geo: {
    lat: '',
    lng: ''
  },
  profile: {
    username: '',
    displayName: '',
    avatarDataUrl: '',
    wallpaperId: 'classic',
    nightMode: false
  }
});
