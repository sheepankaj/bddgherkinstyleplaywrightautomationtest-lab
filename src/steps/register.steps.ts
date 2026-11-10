import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { credentialStore } from '../utils/credentialStore';

const { When, Then } = createBdd(test);

When('I register a new user with random credentials', async ({ registerPage }) => {
  await registerPage.navigate();
  const credentials = await registerPage.registerNewUser();
  credentialStore.save(credentials);
});

Then('I should see the registration success message', async ({ registerPage }) => {
  await registerPage.validateRegistrationSuccess();
});

When('I login with the registered credentials', async ({ homePage }) => {
  const { username, password } = credentialStore.load();
  await homePage.login(username, password);
});
