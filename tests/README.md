# Tests

| Kind | Location | Runner |
|------|----------|--------|
| Unit / domain | `src/**/*.test.ts` (co-located with source) | Vitest (`npm test`) |
| E2E smoke | `tests/e2e/*.spec.ts` | Playwright (`npm run test:e2e`) |

Unit tests live next to the code they cover — for example `src/domain/gamification/service.test.ts`.

E2E tests cover guest flows: landing → dashboard, course unlock, lesson completion, settings, and catalog filters.
