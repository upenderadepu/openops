import { expect, Page } from '@playwright/test';

export async function deleteOpenopsTable(page: Page, tableName: string) {
  const menuItemOfSelectedTable = page
    .locator('li')
    .filter({ hasText: tableName })
    .nth(1);
  await menuItemOfSelectedTable.hover();
  await menuItemOfSelectedTable.locator('.tree__options').click();
  await page.getByText('Delete').click();
  await expect(page.getByRole('link', { name: tableName })).toBeHidden();
}
