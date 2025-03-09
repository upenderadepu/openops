import { Page } from '@playwright/test';

export async function fillOpenOpsTableGetRecordsBlock(
  page: Page,
  params: { tableName: string; filterType: 'AND' | 'OR' },
): Promise<void> {
  await page.getByRole('button', { name: 'Get Records' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Table\*Select an option$/ })
    .getByRole('combobox')
    .click();
  await page.getByRole('option', { name: params.tableName }).click();
  await page
    .getByText('Filter typeSelect an option')
    .locator('button')
    .filter({ hasText: 'Select an option' })
    .click();
  await page.getByPlaceholder('Select an option').fill(params.filterType);
  await page.getByRole('option', { name: params.filterType }).click();
}
