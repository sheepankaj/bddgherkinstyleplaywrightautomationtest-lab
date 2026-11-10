import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async validatePageHeading(heading: string): Promise<void> {
    await this.assertTextVisible(heading);
  }
}
