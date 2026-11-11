import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/fixtures/fixtures.ts'],
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  // In CI use blob reporter (sharding merges them); locally use HTML
  reporter: process.env.CI
    ? [['blob'], ['list']]
    : [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://parabank.parasoft.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-first-failure',
    video: 'retain-on-first-failure',
  },
  projects: [
    {
      // API tests run once — no browser needed
      name: 'api',
      testMatch: /.+\/api\/.+\.spec\.(js|ts)/,
    },
    {
      name: 'chromium',
      testIgnore: /.+\/api\/.+\.spec\.(js|ts)/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /.+\/api\/.+\.spec\.(js|ts)/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /.+\/api\/.+\.spec\.(js|ts)/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
