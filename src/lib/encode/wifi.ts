import type {WifiState} from '@/core/types';

const escapeWifiValue = (value: string): string => {
  return value.replace(/([\\;,:"])/g, '\\$1');
};

export function encodeWifi(state: WifiState): string {
  if(!state.ssid.trim()) return '';

  const type = state.security === 'nopass' ? 'nopass' : state.security;
  const parts = [
    `T:${type}`,
    `S:${escapeWifiValue(state.ssid)}`
  ];

  if(state.security !== 'nopass' && state.password) {
    parts.push(`P:${escapeWifiValue(state.password)}`);
  }

  if(state.hidden) parts.push('H:true');

  return `WIFI:${parts.join(';')};;`;
}
