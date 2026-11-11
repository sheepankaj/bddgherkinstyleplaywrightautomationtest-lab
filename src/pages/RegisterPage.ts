import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../constants/urls';
import { DEFAULT_REGISTRATION_DATA, getTestPassword } from '../constants/testData';

export type UserCredentials = {
  username: string;
  password: string;
};

export class RegisterPage extends BasePage {
  private readonly firstNameInput = this.page.locator('input[name="customer.firstName"]');
  private readonly lastNameInput = this.page.locator('input[name="customer.lastName"]');
  private readonly streetInput = this.page.locator('input[name="customer.address.street"]');
  private readonly cityInput = this.page.locator('input[name="customer.address.city"]');
  private readonly stateInput = this.page.locator('input[name="customer.address.state"]');
  private readonly zipInput = this.page.locator('input[name="customer.address.zipCode"]');
  private readonly phoneInput = this.page.locator('input[name="customer.phoneNumber"]');
  private readonly ssnInput = this.page.locator('input[name="customer.ssn"]');
  private readonly usernameInput = this.page.locator('input[name="customer.username"]');
  private readonly passwordInput = this.page.locator('input[name="customer.password"]');
  private readonly confirmPasswordInput = this.page.locator('input[name="repeatedPassword"]');
  private readonly registerButton = this.page.getByRole('button', { name: 'Register' });
  private readonly successMessage = this.page.getByText('Your account was created successfully', {
    exact: false,
  });

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto(URLS.register);
    // Register button visible = form is ready to interact with
    await this.registerButton.waitFor({ state: 'visible' });
  }

  private generateUniqueUsername(): string {
    // Timestamp + random suffix keeps usernames unique across runs
    return `usr${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
  }

  async registerNewUser(): Promise<UserCredentials> {
    const username = this.generateUniqueUsername();
    const password = getTestPassword(); // throws here at runtime, not at import time
    const { firstName, lastName, street, city, state, zipCode, phone, ssn } =
      DEFAULT_REGISTRATION_DATA;

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    await this.zipInput.fill(zipCode);
    await this.phoneInput.fill(phone);
    await this.ssnInput.fill(ssn);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerButton.click({ force: true });
    // Success message appearing is the definitive proof that registration completed
    await this.successMessage.waitFor({ state: 'visible' });

    return { username, password };
  }

  async validateRegistrationSuccess(): Promise<void> {
    await this.assertTextVisible('Your account was created successfully');
  }
}
