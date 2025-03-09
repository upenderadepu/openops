import { expect, Page } from '@playwright/test';

export async function deleteFlow(page: Page, flowName: string): Promise<void> {
  await page.goto('/flows');
  await expect(
    page.getByRole('button', { name: 'New Workflow' }),
  ).toBeVisible();

  await page.getByPlaceholder('Search...').fill(flowName);

  await page.getByRole('link', { name: flowName }).first().click();
  await page.getByRole('menuitem').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Remove' }).click();

  return expect(
    page.getByTestId('toast').getByText('Removed flow'),
  ).toBeVisible();
}
