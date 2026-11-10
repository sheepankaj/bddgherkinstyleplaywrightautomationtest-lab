import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';

const { Given, When, Then } = createBdd(test);

Given('I navigate to the ParaBank home page', async ({ homePage }) => {
  await homePage.navigate();
});

Then('I should see the {string} text', async ({ homePage }, text: string) => {
  await homePage.validateWelcomeText(text);
});

When(
  'I login with username {string} and password {string}',
  async ({ homePage }, username: string, password: string) => {
    await homePage.login(username, password);
  }
);

Then('I should be on the {string} page', async ({ accountOverviewPage }, heading: string) => {
  await accountOverviewPage.validatePageHeading(heading);
});

When('I click logout', async ({ homePage }) => {
  await homePage.logout();
});
