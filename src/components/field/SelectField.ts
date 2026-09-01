import styles from './field.module.scss';

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldOptions {
  label?: string;
  value: string;
  options: SelectFieldOption[];
  onChange: (value: string) => void;
}

export function createSelectField(options: SelectFieldOptions): HTMLDivElement {
  const root = document.createElement('div');
  root.className = styles.field;

  if(options.label) {
    const label = document.createElement('label');
    label.className = styles.label;
    label.textContent = options.label;
    root.appendChild(label);
  }

  const select = document.createElement('select');
  select.className = `${styles.control} ${styles.select}`;

  for(const option of options.options) {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    select.appendChild(optionEl);
  }

  select.value = options.value;
  select.addEventListener('change', () => options.onChange(select.value));

  root.appendChild(select);
  return root;
}
