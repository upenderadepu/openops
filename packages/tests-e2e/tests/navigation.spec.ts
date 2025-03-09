import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const navigationLinks = [
  { name: 'Runs', title: /Runs/, heading: 'Workflow Runs' },
  { name: 'Connections', title: /Connections/, heading: 'Connections' },
  { name: 'Tables', title: /Tables/, heading: 'Tables' },
  { name: 'Settings', title: /General/, headings: ['Settings', 'General'] },
  { name: 'Flows', title: /OpenOps/, heading: 'All flows' },
];

test.describe('UI Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  navigationLinks.forEach((link) => {
    test(`Can navigate to ${link.name}, with headers ${
      Array.isArray(link.headings) ? link.headings.join(', ') : link.heading
    }`, async ({ page }) => {
      await page.getByRole('link', { name: link.name }).click();
      await expect(page).toHaveTitle(link.title);

      if (Array.isArray(link.headings)) {
        await expect(page.getByRole('heading').first()).toContainText(
          link.headings[0],
        );
        await expect(page.getByRole('heading').last()).toContainText(
          link.headings[1],
        );
      } else {
        await expect(page.getByRole('heading')).toContainText(link.heading);
      }
    });
  });

  test.describe('Builder', () => {
    const navigateToFistFlow = async (page: Page) => {
      // click on first row in the table
      await expect(
        page.getByTestId('data-table-loading-row').first(),
      ).toBeVisible();
      await expect(
        page.getByTestId('data-table-loading-row').first(),
      ).not.toBeVisible();
      await page.locator('tbody > tr:first-child').click();
      await page.waitForURL((url) => url.pathname.includes('flows/'), {
        waitUntil: 'domcontentloaded',
      });
    };

    const expectLinksToBeVisible = async (page: Page, visible: boolean) => {
      for (const link of navigationLinks.map((l) => l.name)) {
        if (visible) {
          await expect(page.getByRole('link', { name: link })).toBeVisible();
        } else {
          await expect(
            page.getByRole('link', { name: link }),
          ).not.toBeVisible();
        }
      }
    };

    test('Can toggle the sidebar', async ({ page }) => {
      await navigateToFistFlow(page);

      await page.getByLabel('Toggle Sidebar').click();
      await expectLinksToBeVisible(page, true);

      await page.getByLabel('Toggle Sidebar').click();
      await expectLinksToBeVisible(page, false);
    });

    test('Can navigate to runs and history ', async ({ page }) => {
      await navigateToFistFlow(page);

      await page.getByLabel('Run Logs').click();
      await page.getByLabel('Version History').click();
      await page.getByLabel('Tree View').click();
      await page.getByLabel('Toggle Sidebar').click();

      await expectLinksToBeVisible(page, true);
    });
  });
});
