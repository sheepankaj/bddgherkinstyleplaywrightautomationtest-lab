import { test as base } from 'playwright-bdd';
import { HomePage, AccountOverviewPage, RegisterPage } from '../pages';
import { UsersApi, UserResponse } from '../api/UsersApi';

export type ApiState = {
  status: number;
  body: UserResponse | null;
};

export type PageFixtures = {
  homePage: HomePage;
  accountOverviewPage: AccountOverviewPage;
  registerPage: RegisterPage;
  usersApi: UsersApi;
  apiState: ApiState;
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
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },
  // Mutable bag for sharing API response between steps within a scenario
  apiState: async ({}, use) => {
    await use({ status: 0, body: null });
  },
});

export { expect } from '@playwright/test';
