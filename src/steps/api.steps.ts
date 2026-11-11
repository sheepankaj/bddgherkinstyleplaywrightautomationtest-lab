import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';

const { Given, Then } = createBdd(test);

Given(
  'I request user with ID {int} from the users API',
  async ({ usersApi, apiState }, id: number) => {
    const result = await usersApi.getUserById(id);
    apiState.status = result.status;
    apiState.body = result.body;
  }
);

Then('the response status code should be {int}', async ({ apiState }, expected: number) => {
  expect(apiState.status).toBe(expected);
});

Then('the user name should be {string}', async ({ apiState }, expected: string) => {
  expect(apiState.body?.name).toBe(expected);
});

Then('the user username should be {string}', async ({ apiState }, expected: string) => {
  expect(apiState.body?.username).toBe(expected);
});

Then('the user email should be {string}', async ({ apiState }, expected: string) => {
  expect(apiState.body?.email).toBe(expected);
});
