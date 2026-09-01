import styles from './field.module.scss';

export interface TextFieldOptions {
  label?: string;
  placeholder?: string;
  value: string;
  textarea?: boolean;
  type?: string;
  maxLength?: number;
  onInput: (value: string) => void;
}

export interface TextFieldHandle {
  root: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
  setValue: (value: string) => void;
}

export function createTextField(options: TextFieldOptions): TextFieldHandle {
  const root = document.createElement('div');
  root.className = styles.field;

  if(options.label) {
    const label = document.createElement('label');
    label.className = styles.label;
    label.textContent = options.label;
    root.appendChild(label);
  }

  const input = options.textarea
    ? document.createElement('textarea')
    : document.createElement('input');

  input.className = options.textarea ? `${styles.control} ${styles.textarea}` : styles.control;
  input.value = options.value;
  if(options.placeholder) input.placeholder = options.placeholder;
  if(options.maxLength) input.maxLength = options.maxLength;
  if(!options.textarea && options.type) (input as HTMLInputElement).type = options.type;

  input.addEventListener('input', () => {
    options.onInput(input.value);
  });

  root.appendChild(input);

  return {
    root,
    input,
    setValue: (value: string) => {
      input.value = value;
    }
  };
}
