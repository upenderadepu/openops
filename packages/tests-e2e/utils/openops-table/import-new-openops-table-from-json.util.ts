import { expect, Page } from '@playwright/test';
import path from 'path';

export async function importNewOpenopsTableFromJson(
  page: Page,
  tableName: string,
): Promise<void> {
  await page.getByTitle('OpenOps Database').click();
  await page.getByText('Create table').click();
  await page.getByRole('textbox').fill(tableName);

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('a').filter({ hasText: 'Import a JSON file' }).click();
  await page.getByRole('button', { name: 'Choose JSON file' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(
    path.join(__dirname, '../../assets/openops-table-setup.json'),
  );

  await page.getByRole('button', { name: 'Add table' }).click();
  await expect(page.getByText('Create new table')).toBeHidden();
}
