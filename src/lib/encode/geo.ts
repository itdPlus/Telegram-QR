import type {GeoState} from '@/core/types';

export function encodeGeo(state: GeoState): string {
  const lat = state.lat.trim();
  const lng = state.lng.trim();
  if(!lat || !lng) return '';
  return `geo:${lat},${lng}`;
}
