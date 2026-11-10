import { test as base } from 'playwright-bdd';
import { HomePage, AccountOverviewPage, RegisterPage } from '../pages';

export type PageFixtures = {
  homePage: HomePage;
  accountOverviewPage: AccountOverviewPage;
  registerPage: RegisterPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  accountOverviewPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from '@playwright/test';
