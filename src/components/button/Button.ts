import {createIcon} from '@/components/icon/Icon';
import type {IconName} from '@/components/icon/iconRegistry';
import styles from './button.module.scss';

export interface ButtonOptions {
  variant?: 'primary' | 'secondary' | 'plain';
  label: string;
  icon?: IconName;
  onClick?: (event: MouseEvent) => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';

  const variant = options.variant ?? 'primary';
  const classNames = [styles.btn, styles[variant]];
  if(options.fullWidth) classNames.push(styles.fullWidth);
  button.className = classNames.join(' ');

  if(options.icon) button.appendChild(createIcon(options.icon));

  const label = document.createElement('span');
  label.textContent = options.label;
  button.appendChild(label);

  button.disabled = !!options.disabled;
  if(options.onClick) button.addEventListener('click', options.onClick);

  return button;
}
