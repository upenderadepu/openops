import { expect, Page } from '@playwright/test';

export async function renameFlow(page: Page, flowName: string): Promise<void> {
  await page.getByTestId('flow-details-panel-actions').click();
  await page.getByText('Rename').click();
  await page.getByPlaceholder('New Workflow Name').type(flowName);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByLabel('Rename Workflow')).toBeHidden();

  //need the click to close flow action menu
  if (await page.getByRole('menuitem', { name: 'Rename' }).isVisible()) {
    await page.getByTestId('flow-details-panel-actions').click({ force: true });
  }
}
