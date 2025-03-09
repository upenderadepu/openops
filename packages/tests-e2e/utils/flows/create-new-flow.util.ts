import { Page } from '@playwright/test';
import { renameFlow } from './rename-flow.util';

export async function createNewFlow(
  page: Page,
  flowName: string,
): Promise<void> {
  await page.goto('/flows');
  const startBuildingButton = page.getByText('Start building your first flow');

  if (await startBuildingButton.isVisible()) {
    // Creates a new flow when there is no flows yet
    await startBuildingButton.click();
    await page.getByText('Start from scratch').click();
  } else {
    // Creates a new flow if there are flows
    await page.getByText('New Worklow').click();
  }

  await page.waitForURL((url) => url.pathname.includes('flows/'), {
    waitUntil: 'domcontentloaded',
  });

  await renameFlow(page, flowName);
}
