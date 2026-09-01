import {ICONS, type IconName} from './iconRegistry';
import styles from './icon.module.scss';

export function createIcon(name: IconName, className?: string): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.className = className ? `${styles.icon} ${className}` : styles.icon;
  wrapper.innerHTML = ICONS[name];
  return wrapper;
}
