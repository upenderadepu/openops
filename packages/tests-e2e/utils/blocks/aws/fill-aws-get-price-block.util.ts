import { Page } from '@playwright/test';

export async function fillAwsGetPriceBlock(
  page: Page,
  params: { connectionName: string; serviceCode: string },
) {
  await page
    .getByRole('button', { name: 'Get Price from Price Catalog AWS' })
    .click();
  await page
    .locator('button')
    .filter({ hasText: 'Select a connection' })
    .click();
  await page
    .getByLabel(params.connectionName, { exact: true })
    .getByText(params.connectionName)
    .click();
  await page.locator('button').filter({ hasText: 'Select an option' }).click();
  await page.getByPlaceholder('Select an option').fill(params.serviceCode);
  return page.getByText(params.serviceCode).click();
}
