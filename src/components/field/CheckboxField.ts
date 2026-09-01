import {createIcon} from '@/components/icon/Icon';
import styles from './field.module.scss';

export interface CheckboxFieldOptions {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function createCheckboxField(options: CheckboxFieldOptions): HTMLLabelElement {
  const root = document.createElement('label');
  root.className = styles.checkboxRow;

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = styles.checkboxInput;
  input.checked = options.checked;

  const box = document.createElement('span');
  box.className = styles.checkbox;
  box.appendChild(createIcon('check'));

  const label = document.createElement('span');
  label.className = styles.checkboxLabel;
  label.textContent = options.label;

  input.addEventListener('change', () => options.onChange(input.checked));

  root.append(input, box, label);
  return root;
}
