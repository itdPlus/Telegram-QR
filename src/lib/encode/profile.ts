import type {ProfileState} from '@/core/types';

export function encodeProfile(state: ProfileState): string {
  const username = state.username.trim().replace(/^@/, '');
  if(!username) return '';
  return `https://t.me/${username}`;
}
