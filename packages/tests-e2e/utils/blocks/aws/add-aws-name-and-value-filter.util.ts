import { expect, Page } from '@playwright/test';

export async function addAwsNameAndValueFilter(
  page: Page,
  params: { name: string; value: string; index: number },
) {
  await page.getByTestId('appendNewArrayItemButton').click();

  await page
    .getByTestId('arrayPropertiesItem' + params.index)
    .getByTestId('searchableSelectTrigger')
    .first()
    .click();
  await expect(page.getByTestId('searchableSelectInput')).toBeVisible();
  await page.getByTestId('searchableSelectInput').fill(params.name);
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
  await page.getByTestId('searchableSelectInput').fill(params.value);
  await page
    .getByTestId('searchableSelectOption')
    .getByText(params.value, { exact: true })
    .click();

  return expect(page.getByTestId('searchableSelectContent')).not.toBeVisible();
}
