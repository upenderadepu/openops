import { Page } from '@playwright/test';

export async function addBlockByName(
  page: Page,
  params: { blockName: string; actionName: string },
): Promise<void> {
  await page.getByTestId('addBlockPlusIcon').last().click();

  await page.getByRole('textbox', { name: 'Search' }).type(params.blockName);

  await page.waitForResponse(
    (response) =>
      response.url().includes('/blocks') &&
      response
        .url()
        .includes(`searchQuery=${params.blockName.replace(' ', '%20')}`) &&
      response.status() === 200 &&
      response.request().method() === 'GET',
  );

  await page.getByText(params.blockName, { exact: true }).click();
  await page
    .getByTestId('blocksList')
    .getByText(params.actionName, { exact: true })
    .click();
}
