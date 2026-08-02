# Project structure

Краткая карта репозитория — что где лежит и зачем.

## Корень

| Путь | Назначение |
|------|------------|
| `src/` | Исходный код приложения |
| `content/` | Курсы и уроки (MDX + meta.json) |
| `public/` | Статика: иконки PWA, обложки, screen backgrounds |
| `tests/` | E2E-тесты Playwright |
| `docs/` | Архитектура, дизайн-система, эта карта |
| `scripts/` | Утилиты CI/локально (Lighthouse) |
| `*.config.*` | Конфиги Next.js, TypeScript, ESLint, Vitest, Playwright — **остаются в корне** по требованиям инструментов |
| `AGENTS.md` / `CLAUDE.md` | Правила для AI-ассистентов в IDE |

## `src/` — слои

```
src/
├── app/              # Next.js App Router: страницы, layouts, API, SW
├── features/         # Сценарии пользователя (dashboard, learning, catalog…)
├── components/       # Переиспользуемый UI (course, lesson, progress, layout)
├── domain/           # Чистая бизнес-логика (progress, gamification, quiz)
├── data/             # Репозитории: content FS, IndexedDB, auth, db
├── design-system/    # Токены, motion, icons, theme
├── hooks/            # React hooks (user id, и т.д.)
├── queries/          # TanStack Query (progress snapshot)
└── stores/           # Zustand (только UI, напр. черновики квиза)
```

**Правило:** новая фича → `features/`, переиспользуемый блок → `components/`, правила без UI → `domain/`, доступ к данным → `data/`.

## `content/`

```
content/courses/{slug}/
├── meta.json         # Название, порядок, теги, lessonOrder
└── lessons/*.mdx     # Уроки с frontmatter и квизами
```

## `public/images/`

| Папка | Содержимое |
|-------|------------|
| `covers/` | Обложки карточек курсов |
| `screens/` | Фоновые атмосферные изображения экранов |
| *(корень images/)* | Hero, dashboard-path и прочие one-off |

## Тесты

- **Unit:** `src/**/*.test.ts` — Vitest, рядом с кодом
- **E2E:** `tests/e2e/` — Playwright smoke

Подробнее: [tests/README.md](../tests/README.md).
