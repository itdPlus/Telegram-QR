# Telegram QR

Генератор QR-кодов в фирменном визуальном стиле Telegram. Профиль в Telegram, ссылка, Wi-Fi, текст, событие календаря или геолокация превращаются в оформленный QR-код с рамкой, цветовыми пресетами и логотипом с экспортом в PNG или SVG.

## Возможности

- **6 категорий контента**: профиль, ссылка, Wi-Fi, текст, событие, геолокация
- **Оформление в стиле Telegram**: пресеты цветов, рамка/подпись, логотип Telegram или свой собственный
- **Экспорт** готового QR-кода в PNG и SVG
- **Корректная кодировка** payload'а — кириллица и любые не-ASCII символы не повреждаются при генерации QR (см. `toQrSafeUtf8` в `src/lib/qr/renderer.ts`)

## Быстрый старт

```bash
git clone https://github.com/itdPlus/Telegram-QR.git
cd Telegram-QR
npm install
npm run dev
```

Откройте `http://localhost:5173` в браузере.

### Другие команды

```bash
npm run typecheck   # проверка типов (tsc --noEmit)
npm run build       # прод-сборка → dist/
npm run preview     # локальный просмотр прод-сборки
```

Подробности по архитектуре и соглашениям кода — в [AGENTS.md](AGENTS.md).

## Версионирование и релизы

Проект следует [Семантическое Версионирование](https://semver.org/lang/ru/). Версия, `CHANGELOG.md` и GitHub Releases обновляются автоматически через [release-please](https://github.com/googleapis/release-please) на основе коммитов в формате [Conventional Commits](https://www.conventionalcommits.org/ru/). Подробнее — в [CONTRIBUTING.md](CONTRIBUTING.md).

## Участие в разработке

PR и issue приветствуются — см. [CONTRIBUTING.md](CONTRIBUTING.md).

## Лицензия

[MIT](LICENSE)

## Ссылки

- GitHub: [github.com/itdPlus/Telegram-QR](https://github.com/itdPlus/Telegram-QR)
- Telegram-канал автора: [t.me/itdStatus](https://t.me/itdStatus)

---

## Заметка

> _Проект не готов полностью, и в нём могут быть баги \ недоработки, и мне об этом известно. Следите за [Issues](https://github.com/itdPlus/Telegram-QR/issues)_
