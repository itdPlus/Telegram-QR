# Contributing

Спасибо за интерес к проекту! Ниже — короткий гайд по разработке.

## Разработка

```bash
npm install
npm run dev        # dev-сервер с HMR
npm run typecheck  # проверка типов
npm run build      # прод-сборка в dist/
```

Node.js 20+.

## Коммиты и версионирование

Проект использует [Semantic Versioning](https://semver.org/lang/ru/), версия
и `CHANGELOG.md` обновляются автоматически инструментом
[release-please](https://github.com/googleapis/release-please) на основе
сообщений коммитов в формате [Conventional Commits](https://www.conventionalcommits.org/ru/).

Заголовок коммита должен иметь вид `type(scope): описание`:

| Тип | Когда использовать | Влияние на версию |
|---|---|---|
| `fix:` | исправление бага | `PATCH` (0.1.0 → 0.1.1) |
| `feat:` | новая функциональность | `MINOR` (0.1.0 → 0.2.0) |
| `feat!:` / `fix!:` / футер `BREAKING CHANGE:` | несовместимое изменение | `MAJOR` (0.1.0 → 1.0.0) |
| `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:` | не влияет на публичное поведение | версию не меняет |

Примеры:

```
feat(header): добавить ссылки на GitHub и Telegram-канал
fix(qr): исправить экспорт PNG на Safari
docs: обновить README
```

При мёрже в `main` `release-please` сам откроет (или обновит) release PR с
новой версией и записью в `CHANGELOG.md`; после его мёржа будет создан тег и
GitHub Release.

## Pull Request

1. Форкните репозиторий, создайте ветку от `main`.
2. Следуйте существующему стилю кода (см. [AGENTS.md](AGENTS.md)).
3. Убедитесь, что `npm run typecheck` и `npm run build` проходят локально.
4. Оформите коммиты по Conventional Commits.
5. Откройте PR с коротким описанием, что и зачем изменено.

## Баг-репорты и предложения

Используйте [Issues](https://github.com/itdPlus/Telegram-QR/issues) — по
возможности приложите шаги воспроизведения, скриншоты и версию браузера.
