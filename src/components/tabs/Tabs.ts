import {createIcon} from '@/components/icon/Icon';
import type {IconName} from '@/components/icon/iconRegistry';
import type {CategoryId} from '@/core/types';
import styles from './tabs.module.scss';

const TAB_ITEMS: {id: CategoryId; label: string; icon: IconName}[] = [
  {id: 'profile', label: 'Профиль', icon: 'userCircle'},
  {id: 'link', label: 'Ссылка', icon: 'link'},
  {id: 'wifi', label: 'Wi-Fi', icon: 'wifi'},
  {id: 'text', label: 'Текст', icon: 'text'},
  {id: 'event', label: 'Событие', icon: 'calendar'},
  {id: 'geo', label: 'Геолокация', icon: 'location'}
];

export interface TabsOptions {
  value: CategoryId;
  onChange: (category: CategoryId) => void;
}

export function createTabs(options: TabsOptions): {
  root: HTMLDivElement;
  setValue: (value: CategoryId) => void;
} {
  const root = document.createElement('div');
  root.className = styles.tabs;

  const tabElements = new Map<CategoryId, HTMLButtonElement>();

  const applyActive = (value: CategoryId) => {
    for(const [id, element] of tabElements) {
      element.classList.toggle(styles.tabActive, id === value);
    }
  };

  for(const item of TAB_ITEMS) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = styles.tab;
    tab.appendChild(createIcon(item.icon));

    const label = document.createElement('span');
    label.className = styles.label;
    label.textContent = item.label;
    tab.appendChild(label);

    tab.addEventListener('click', () => {
      options.onChange(item.id);
      applyActive(item.id);
    });

    tabElements.set(item.id, tab);
    root.appendChild(tab);
  }

  applyActive(options.value);

  return {root, setValue: applyActive};
}
