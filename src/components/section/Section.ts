import styles from './section.module.scss';

export interface SectionOptions {
  title?: string;
  className?: string;
}

export interface SectionHandle {
  root: HTMLElement;
  body: HTMLDivElement;
}

export function createSection(options: SectionOptions = {}): SectionHandle {
  const root = document.createElement('section');
  root.className = options.className ? `${styles.section} ${options.className}` : styles.section;

  if(options.title) {
    const title = document.createElement('h2');
    title.className = styles.title;
    title.textContent = options.title;
    root.appendChild(title);
  }

  const body = document.createElement('div');
  body.className = styles.body;
  root.appendChild(body);

  return {root, body};
}
