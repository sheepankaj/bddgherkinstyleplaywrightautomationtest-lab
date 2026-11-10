import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS, URL_PATTERNS } from '../constants/urls';

export class HomePage extends BasePage {
  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.getByRole('button', { name: 'Log In' });

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto(URLS.home);
    // The login form being visible proves the page is interactive — not a time-based wait
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.assertTextVisible('Customer Login');
  }

  async validateWelcomeText(text: string): Promise<void> {
    // "Welcome to ParaBank" is baked into a banner JPEG — not a DOM text node.
    const keywords = text.split(/\s+/).filter(w => w.length > 2);
    if (keywords.length === 0) {
      throw new Error(`validateWelcomeText: step text must not be empty, got: "${text}"`);
    }
    for (const word of keywords) {
      await this.assertPageTitleContains(word);
    }
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // force:true bypasses CSS hover-animation stability checks on ParaBank's submit button
    await this.loginButton.click({ force: true });
    await this.page.waitForURL(URL_PATTERNS.overview);
  }
}
