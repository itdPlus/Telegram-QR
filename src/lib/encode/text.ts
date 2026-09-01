import type {TextState} from '@/core/types';

export function encodeText(state: TextState): string {
  return state.text;
}
