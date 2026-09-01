import calendar from '@/assets/icons/calendar.svg?raw';
import check from '@/assets/icons/check.svg?raw';
import close from '@/assets/icons/close.svg?raw';
import copy from '@/assets/icons/copy.svg?raw';
import darkmode from '@/assets/icons/darkmode.svg?raw';
import download from '@/assets/icons/download.svg?raw';
import github from '@/assets/icons/github.svg?raw';
import link from '@/assets/icons/link.svg?raw';
import location from '@/assets/icons/location.svg?raw';
import qr from '@/assets/icons/qr.svg?raw';
import telegramLogo from '@/assets/icons/telegram-logo.svg?raw';
import telegramPlane from '@/assets/icons/telegram-plane.svg?raw';
import text from '@/assets/icons/text.svg?raw';
import userCircle from '@/assets/icons/user_circle.svg?raw';
import wifi from '@/assets/icons/wifi.svg?raw';

export const ICONS = {
  calendar,
  check,
  close,
  copy,
  darkmode,
  download,
  github,
  link,
  location,
  qr,
  telegramLogo,
  telegramPlane,
  text,
  userCircle,
  wifi
} as const;

export type IconName = keyof typeof ICONS;
