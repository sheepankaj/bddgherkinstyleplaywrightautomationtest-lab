# ParaBank BDD Playwright Automation Framework

BDD Gherkin-style test automation for the [ParaBank](https://parabank.parasoft.com) demo banking application, built with Playwright and TypeScript using the Page Object Model pattern.

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) v1.64 | Cross-browser automation (Chromium, Firefox, WebKit) |
| [playwright-bdd](https://github.com/vitalets/playwright-bdd) v9 | Gherkin BDD layer for Playwright |
| TypeScript v5.6 | Type safety |
| Page Object Model | Maintainable selector abstraction |
| dotenv | Local environment variable loading |
| ESLint 10 + typescript-eslint 8 | Code quality and static analysis |
| Prettier 3 | Consistent code formatting |
| GitHub Actions | CI/CD pipeline |
| Docker | Containerised runs (Kubernetes-ready) |

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

```bash
git clone <repo-url>
cd bddgherkinstyleplaywrightautomationtest-lab
npm install
npx playwright install chromium firefox webkit
cp .env.example .env        # then open .env and set TEST_PASSWORD
npm test
```

## Project Structure

```
├── features/
│   └── auth/
│       └── register_login.feature    # Gherkin scenarios
├── src/
│   ├── constants/
│   │   ├── urls.ts                   # URL paths + waitForURL regex patterns
│   │   └── testData.ts               # Static registration data (password from .env)
│   ├── fixtures/
│   │   └── fixtures.ts               # Custom playwright-bdd fixtures (POM injection)
│   ├── pages/
│   │   ├── index.ts                  # Barrel export
│   │   ├── BasePage.ts               # Abstract base — shared assertions & logout
│   │   ├── HomePage.ts               # Login form, welcome validation
│   │   ├── RegisterPage.ts           # Registration form
│   │   └── AccountOverviewPage.ts    # Post-login page validation
│   ├── steps/
│   │   ├── login.steps.ts            # Auth step definitions
│   │   └── register.steps.ts         # Registration step definitions
│   └── utils/
│       └── credentialStore.ts        # Cross-scenario JSON credential store
├── .github/workflows/
│   └── playwright-tests.yml          # CI pipeline
├── .env.example                      # Required env vars template (commit this, not .env)
├── Dockerfile                        # Kubernetes-ready image
├── docker-compose.yml                # Local containerised run
└── playwright.config.ts              # Playwright + BDD configuration
```

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Generate BDD files + run all browsers headless |
| `npm run test:headed` | Run with browser UI visible |
| `npm run test:ui` | Interactive Playwright UI mode |
| `npm run test:report` | Open last HTML report |
| `npx playwright test --project=chromium` | Single browser only |

## Code Quality

| Command | Description |
|---|---|
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm run lint` | ESLint — reports code quality issues |
| `npm run lint:fix` | ESLint — auto-fixes what it can |
| `npm run format` | Prettier — formats all `src/**/*.ts` |
| `npm run format:check` | Prettier — CI check, exits non-zero if anything needs formatting |

Run all checks before pushing:
```bash
npm run typecheck && npm run lint && npm run format:check && npm test
```

## Scenarios

### Scenario 1 — Register a new user and verify account creation
1. Navigate to the ParaBank home page
2. Validate "Welcome to ParaBank" (via page title keywords)
3. Register with a generated unique username (`usr{timestamp}{random}`)
4. Validate the success message "Your account was created successfully"
5. Logout and validate the welcome page again

### Scenario 2 — Login with the registered user and validate account overview
1. Navigate to the ParaBank home page
2. Login with credentials saved by Scenario 1
3. Validate the "Accounts Overview" heading
4. Logout and validate the welcome page

> **Dependency:** Scenario 2 reads credentials from `.tmp/registered-user.json` written by Scenario 1. Always run the full suite (`npm test`) so they execute in order. `.tmp` is git-ignored and excluded from Docker images.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `TEST_PASSWORD` | Yes | Password used when registering test users. Set in `.env` locally; use a GitHub Secret in CI. |
| `BASE_URL` | No | Target application URL. Default: `https://parabank.parasoft.com` |
| `CI` | No | Set to `true` in CI — enables retries and strict `forbidOnly` mode |

Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

## Docker

```bash
# Build and run with default URL
docker compose up

# Override target environment and password
BASE_URL=https://staging.example.com TEST_PASSWORD=secret docker compose up
```

The Docker image is built on the official `mcr.microsoft.com/playwright` base and is Kubernetes-ready — override variables via a ConfigMap or Secret at runtime. `.env` and `.tmp` are excluded from the image via `.dockerignore`.

> `TEST_PASSWORD` is intentionally **not** required at `docker build` time. `bddgen` runs when the container starts (`npm test` = `bddgen && playwright test`), so the secret is only needed at runtime.

## CI/CD (GitHub Actions)

The workflow (`.github/workflows/playwright-tests.yml`) runs on:
- Push or pull request to `main` / `develop`
- Manual dispatch with an optional target environment URL

**Setup required:** Add `TEST_PASSWORD` as a repository secret in GitHub → Settings → Secrets and variables → Actions.

**Jobs:**
1. **test** — installs deps, installs Chromium, runs `bddgen`, cleans stale `.tmp` credentials, runs `playwright test`, uploads HTML report and raw results as artifacts
2. **docker-build** — builds and verifies the Docker image on merge to `main`

## VS Code Integration

Install the **Cucumber (Gherkin) Full Support** extension (`alexkrechik.cucumberautocomplete`) for:
- F12 / Ctrl+Click navigation from `.feature` steps to TypeScript definitions
- Step autocomplete in feature files
- Step validation highlighting

The `.vscode/settings.json` in this repo already points the extension at `src/steps/**/*.ts`.
