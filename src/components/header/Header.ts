import {createIcon} from '@/components/icon/Icon';
import styles from './header.module.scss';

const GITHUB_URL = 'https://github.com/itdPlus/Telegram-QR';
const TELEGRAM_CHANNEL_URL = 'https://t.me/itdStatus';

function createHeaderLink(url: string, icon: Parameters<typeof createIcon>[0], label: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.className = styles.action;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', label);
  link.title = label;
  link.appendChild(createIcon(icon));
  return link;
}

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = styles.header;

  const inner = document.createElement('div');
  inner.className = styles.inner;

  const logo = createIcon('telegramLogo', styles.logo);

  const titles = document.createElement('div');
  titles.className = styles.titles;

  const title = document.createElement('h1');
  title.className = styles.title;
  title.textContent = 'QR-генератор';

  const subtitle = document.createElement('span');
  subtitle.className = styles.subtitle;
  subtitle.textContent = 'Создавайте QR-коды в фирменном стиле Telegram';

  titles.append(title, subtitle);

  const actions = document.createElement('div');
  actions.className = styles.actions;
  actions.append(
    createHeaderLink(GITHUB_URL, 'github', 'Исходный код на GitHub'),
    createHeaderLink(TELEGRAM_CHANNEL_URL, 'telegramPlane', 'Telegram-канал автора')
  );

  inner.append(logo, titles, actions);
  header.appendChild(inner);

  return header;
}
