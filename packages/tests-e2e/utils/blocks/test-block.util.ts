import { expect, Page } from '@playwright/test';

export async function testBlock(
  page: Page,
  params: {
    testButtonName: string;
    retestButtonName: string;
    expectedResult: string;
    failedResult: string;
  } = {
    testButtonName: 'Test Step Ctrl + G',
    retestButtonName: 'Retest Ctrl + G',
    expectedResult: 'Tested Successfully',
    failedResult: 'Testing Failed',
  },
): Promise<void> {
  await expect(
    page.getByRole('button', { name: params.testButtonName }),
  ).not.toBeDisabled();
  await page.getByRole('button', { name: params.testButtonName }).click();
  await expect(
    page.getByRole('button', { name: params.retestButtonName }),
  ).not.toBeDisabled();

  if (await page.getByText(params.failedResult).isVisible()) {
    throw new Error(`Test failed: '${params.failedResult}' is visible.`);
  }

  return expect(page.getByText(params.expectedResult)).toBeVisible();
}
