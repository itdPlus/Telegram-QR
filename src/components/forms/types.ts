import type {Store} from '@/core/store';
import type {AppState} from '@/core/types';

export interface CategoryForm {
  mount(container: HTMLElement, store: Store<AppState>): void;
}
