# AGENTS.md — Telegram-QR

Canonical instructions for **every** coding agent working in this repo
(Claude Code, Codex, Cursor, Zed, …). `CLAUDE.md` is only a pointer that
imports this file — edit AGENTS.md, never CLAUDE.md.

## Project Overview

**Telegram-QR** is a client-side QR-code generator styled after Telegram's
visual language. It builds QR codes for profile links, URLs, Wi-Fi, plain
text, calendar events and geo-coordinates, with Telegram-style framing,
color presets and logo embedding. Everything runs in the browser — there is
no backend.

Author: itdStatus. License: MIT.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Vanilla TypeScript, hand-written DOM components (no framework) |
| Language | TypeScript 5.6, `strict: true` |
| Build | Vite 5 |
| CSS | SCSS Modules (`*.module.scss`) |
| QR engine | [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) |

## Development

```bash
npm install
npm run dev          # Dev server (Vite)
npm run typecheck    # tsc --noEmit
npm run build         # typecheck + production build → dist/
npm run preview       # Preview the production build locally
```

There is no test suite and no linter configured yet — `npm run typecheck`
and `npm run build` are the only required checks, and CI (`.github/workflows/ci.yml`)
runs exactly those two.

## Directory Structure

```
src/
├── app/            # App.ts — root component wiring the whole page together
├── components/     # UI components, one folder per component
│   ├── button/
│   ├── colorSwatches/
│   ├── field/          # CheckboxField, SelectField, TextField
│   ├── forms/           # One form per QR category (Link, Wifi, Text, Event, Geo, Profile)
│   ├── header/
│   ├── icon/            # createIcon() + iconRegistry.ts (single source of truth for SVGs)
│   ├── lookPicker/       # Frame / color / logo picker for the QR preview
│   ├── profileCard/
│   ├── qrPreview/
│   ├── radioTiles/
│   ├── section/
│   └── tabs/
├── core/           # store.ts (tiny pub-sub state container), types.ts (AppState & friends)
├── lib/
│   ├── encode/          # Payload builders per category (vCard, WIFI:, geo:, vevent, plain text)
│   ├── qr/               # QR rendering, Telegram styling, PNG/SVG export
│   ├── color.ts, download.ts, file.ts, wallpapers.ts
├── style/          # global.scss, _tokens.scss (design tokens), _mixins.scss
├── assets/icons/    # Raw SVGs imported via `?raw` and re-exported from iconRegistry.ts
└── main.ts          # Entry point — mounts createApp() into #app
```

## Path Aliases

```typescript
@/*   → src/*
```

Configured in both `tsconfig.json` (`paths`) and `vite.config.ts`
(`resolve.alias`) — keep the two in sync if you ever change it. Always import
via `@/...`, never relative `../../` chains across component folders.

## Code Style

No linter is configured, but the existing code consistently follows these
conventions — match them:

- **No space after keywords**: `if(cond)`, `for(...)`, `while(...)` — not `if (cond)`
- **No space inside `{}` / `[]`**: `{a: 1}`, `{...state, ...patch}` — not `{ a: 1 }`
- **No trailing comma** anywhere
- **No space before function paren**: `function foo()`
- Single quotes, 2-space indent, LF + final newline, no trailing whitespace
  (see `.editorconfig`)
- `strict: true` in `tsconfig.json` — avoid `any`; prefer precise unions like
  the `CategoryId` / `LookType` types in `src/core/types.ts`

## Key Patterns

### Components

Components are plain functions that build and return a `HTMLElement`
(or a small object with `.root`/`.mount()` for stateful ones, e.g.
`createTabs`, `FORM_REGISTRY[category].mount(...)`). There is no virtual DOM
— components imperatively create nodes, set `className` from the paired
`.module.scss`, and wire event listeners directly:

```typescript
import styles from './myComponent.module.scss';

export function createMyComponent(): HTMLElement {
  const root = document.createElement('div');
  root.className = styles.root;
  // ...append children, attach listeners...
  return root;
}
```

### State

`Store<T>` (`src/core/store.ts`) is a minimal pub-sub container — `get()`,
`set(patch)`, `update(mutator)`, `subscribe(listener)`. A single `Store<AppState>`
instance is created in `createApp()` (`src/app/App.ts`) and threaded down to
whatever needs it (forms, preview, look picker). Don't introduce a second
state container or a global singleton — pass the store explicitly.

### Icons

All SVGs live in `src/assets/icons/` and must be registered in
`src/components/icon/iconRegistry.ts` (imported with the `?raw` Vite suffix)
before use. Render them with `createIcon('name', optionalClassName)` from
`src/components/icon/Icon.ts` — never inline raw `<svg>` markup in a
component. New icons should be simple, single-color outlines using
`fill="currentColor"` so they inherit text color and theme correctly.

### Forms

Each QR category (`link`, `wifi`, `text`, `event`, `geo`, `profile`) has a
`CategoryForm` (`src/components/forms/types.ts`) with a `mount(container, store)`
method, registered in `FORM_REGISTRY` in `src/app/App.ts`. Payload encoding
for each category lives separately in `src/lib/encode/*.ts` — keep form UI
and payload-string generation decoupled.

### QR rendering & export

`src/lib/qr/renderer.ts` wraps `qr-code-styling` and pre-encodes strings as
UTF-8 byte sequences before handing them to the library (see the comment in
`toQrSafeUtf8`) — the library's Byte-mode encoder truncates anything above
U+00FF otherwise, which would silently corrupt Cyrillic payloads. Don't
bypass `toQrSafeUtf8` when adding new export paths. PNG/SVG export live in
`exportPng.ts` / `exportSvg.ts`; Telegram-specific frame/logo geometry is in
`telegramQrStyle.ts`.

## CSS / SCSS

- Design tokens (colors, radii, shadows, breakpoints) in `src/style/_tokens.scss`
  — reference them via `@use '@/style/tokens' as *;`, never hardcode hex
  values that already exist as a token.
- Shared mixins/functions in `src/style/_mixins.scss`: `hover-surface()`,
  `focus-ring()`, `primary-alpha($alpha)`, `custom-scrollbar()`. Reuse these
  instead of re-implementing hover/focus states.
- Component-scoped styles live next to the component as `*.module.scss` and
  are imported as `styles` (CSS Modules, camelCase locals via
  `localsConvention: 'camelCaseOnly'` in `vite.config.ts`).

## Versioning & Releases

This repo uses [Semantic Versioning](https://semver.org/) automated by
[release-please](https://github.com/googleapis/release-please), driven by
[Conventional Commits](https://www.conventionalcommits.org/). **Do not**
hand-edit the `version` field in `package.json`, `CHANGELOG.md`, or
`.release-please-manifest.json` — release-please owns them. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the commit format.

## What NOT to Do

- Do not add a new state container, router, or UI framework — this is an
  intentionally dependency-light vanilla TS app.
- Do not inline raw SVG strings in components — register icons in
  `iconRegistry.ts` and use `createIcon()`.
- Do not hardcode colors/spacing that already exist as a token in
  `_tokens.scss`.
- Do not hand-edit generated release artifacts (see "Versioning & Releases").
- Never commit on your own initiative — only when explicitly asked.
