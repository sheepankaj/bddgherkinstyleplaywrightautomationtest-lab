import { Page, expect } from '@playwright/test';
import { URL_PATTERNS } from '../constants/urls';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertTextVisible(text: string, timeout = 10_000): Promise<void> {
    await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible({ timeout });
  }

  async assertPageTitleContains(keyword: string, timeout = 10_000): Promise<void> {
    if (!keyword.trim()) {
      throw new Error(
        'assertPageTitleContains: keyword must not be empty — empty regex matches everything'
      );
    }
    await expect(this.page).toHaveTitle(new RegExp(keyword, 'i'), { timeout });
  }

  async logout(): Promise<void> {
    await this.page.locator('a[href*="logout"]').click({ force: true });
    // Wait for the redirect back to the home page — URL change is the reliable completion signal
    await this.page.waitForURL(URL_PATTERNS.home);
  }
}
