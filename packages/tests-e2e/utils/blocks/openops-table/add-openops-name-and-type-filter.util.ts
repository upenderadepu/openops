import { expect, Page } from '@playwright/test';

export async function addOpenopsNameAndTypeFilter(
  page: Page,
  params: { name: string; type: string; value?: string; index: number },
): Promise<void> {
  await page.getByTestId('appendNewArrayItemButton').click();
  await page
    .getByTestId('arrayPropertiesItem' + params.index)
    .getByTestId('searchableSelectTrigger')
    .first()
    .click();
  await expect(page.getByTestId('searchableSelectInput')).toBeVisible();
  await page.getByTestId('searchableSelectInput').fill(params.name);
  await expect(
    page
      .getByTestId('searchableSelectOption')
      .getByText(params.name, { exact: true }),
  ).toBeVisible();
  await page
    .getByTestId('searchableSelectOption')
    .getByText(params.name, { exact: true })
    .click();

  await expect(
    page
      .getByTestId('arrayPropertiesItem' + params.index)
      .getByTestId('searchableSelectTrigger')
      .last(),
  ).toBeEnabled();
  await page
    .getByTestId('arrayPropertiesItem' + params.index)
    .getByTestId('searchableSelectTrigger')
    .last()
    .click();
  await expect(page.getByTestId('searchableSelectInput')).toBeVisible();
  await page.getByTestId('searchableSelectInput').fill(params.type);
  await page
    .getByTestId('searchableSelectOption')
    .getByText(params.type, { exact: true })
    .click();

  if (params.value) {
    await page
      .getByTestId('arrayPropertiesItem' + params.index)
      .locator('.tiptap')
      .fill(params.value);
  }
}
