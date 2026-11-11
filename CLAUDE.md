# ParaBank BDD Automation — Claude Instructions

## What this project is

Playwright + TypeScript BDD automation framework for the ParaBank demo banking app. Uses `playwright-bdd` v9 (Gherkin layer over Playwright's test runner) with a Page Object Model.

## Environment setup

Copy `.env.example` to `.env` and set `TEST_PASSWORD` before running tests locally. `playwright.config.ts` loads it via `import 'dotenv/config'` at startup — env vars are available to all test files by the time they import from `src/constants/`.

## Run commands

```bash
npm test                                        # bddgen + run all browsers headless
npm run test:headed                             # visual run
npm run bddgen                                  # regenerate .features-gen/ from feature files
npm run typecheck                               # tsc --noEmit (type-check only, no emit)
npm run lint                                    # ESLint — code quality issues
npm run lint:fix                                # ESLint — auto-fix
npm run format                                  # Prettier — format src/**/*.ts
npm run format:check                            # Prettier — CI check (non-zero exit if unformatted)
npx playwright test --project=chromium          # single browser
npx playwright test --project=chromium,webkit   # skip Firefox
```

Pre-push checklist (run in order):
```bash
npm run typecheck && npm run lint && npm run format:check && npm test
```

> Always run `npm run bddgen` before `npx playwright test` when feature files or step definitions change. The `npm test` script does both.

## Project layout

```
src/constants/      urls.ts (URLS paths + URL_PATTERNS regexes), testData.ts (env-backed data)
src/pages/          POM classes — extend BasePage; barrel-exported from index.ts
src/fixtures/       Custom playwright-bdd test extension with POM fixtures
src/steps/          Step definitions; import fixtures from '../fixtures/fixtures'
src/utils/          credentialStore — JSON file bridge for cross-scenario credentials (.tmp/)
features/           Gherkin .feature files
.features-gen/      Auto-generated — never edit, in .gitignore
.env                Local secrets — git-ignored; copy from .env.example
.env.example        Committed template showing required env var names (no values)
```

## Architecture rules

- **Page classes** extend `BasePage` and own their locators as `private readonly` fields.
- **Steps** receive page objects via fixtures — never instantiate pages directly in steps.
- **URL constants** (`src/constants/urls.ts`): `URLS` for `page.goto()` paths; `URL_PATTERNS` for `page.waitForURL()` regexes. Both in one file so they stay in sync.
- **Sensitive test data** (`TEST_PASSWORD`) lives in `.env` locally and in a GitHub/K8s secret in CI/production. `testData.ts` exports `getTestPassword()` — a function that reads the env var and throws only when called (at registration time), never at module import time. This keeps `bddgen` and Docker builds working without the secret.
- **Cross-scenario state** (e.g. registered credentials) goes through `credentialStore` (file-based JSON at `.tmp/registered-user.json`). Do not use module-level variables for this — they don't survive across worker processes.
- `.tmp` is git-ignored and excluded from Docker images. The CI workflow explicitly deletes it before each test run to prevent stale credentials on self-hosted runners.

## Adding a new page

1. Create `src/pages/MyPage.ts` extending `BasePage`
2. Add export to `src/pages/index.ts`
3. Add fixture in `src/fixtures/fixtures.ts` (`PageFixtures` type + `test.extend`)
4. Create `src/steps/mypage.steps.ts` using `createBdd(test)`

## Adding a new scenario

- Self-contained scenarios: use the standard fixture approach
- Scenarios that share state across test boundaries: use `credentialStore` pattern
- Run order within a feature file is top-to-bottom (guaranteed by `workers: 1` and `fullyParallel: false`)

## ParaBank-specific quirks — do not remove these patterns

| Situation | Why / Fix |
|---|---|
| "Welcome to ParaBank" not in DOM | Text is baked into a background JPEG. Validate via `assertPageTitleContains(word)` for each keyword in the step text |
| Login / logout clicks timeout | CSS hover animations cause Playwright stability failures. Use `click({ force: true })` |
| Wait after login | `page.waitForURL(URL_PATTERNS.overview)` — URL change is the authoritative signal |
| Wait after logout | `page.waitForURL(URL_PATTERNS.home)` — same reason |
| Wait after registration | URL stays at `register.htm`; wait for `successMessage.waitFor({ state: 'visible' })` |
| `networkidle` | Never use it — unreliable in production. Use element/URL waits instead |
| Empty string in step text | `validateWelcomeText("")` throws intentionally — empty regex matches everything |

## Code quality tools

- **ESLint** (`eslint.config.mjs`) — `typescript-eslint/recommended` + `eslint-config-prettier`. Runs on `src/` only; `.features-gen/` is ignored.
- **Prettier** (`.prettierrc`) — single quotes, 100-char print width, ES5 trailing commas. Runs on `src/**/*.ts`; `.feature` files are excluded (no built-in Gherkin parser).
- The two tools are intentionally separate: ESLint catches logic/type issues, Prettier handles formatting. Never use `eslint-plugin-prettier` — it conflates the two.

## TypeScript

- `strict: true` — no implicit any, no unchecked nulls
- Do not use `_prefix` on parameters that are actually used (it signals "intentionally unused")
- All page locators: `private readonly` class fields, not method-local variables
