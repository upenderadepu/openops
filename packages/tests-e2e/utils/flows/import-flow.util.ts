import { Page } from '@playwright/test';
import { renameFlow } from './rename-flow.util';

export async function importFlow(
  page: Page,
  flowName: string,
  fileUrl: string,
): Promise<void> {
  await page.goto('/flows');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Import workflow').click();
  await page.getByTestId('importFlowFileInput').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(fileUrl);

  await page.getByTestId('importFlowButton').click();

  await page.waitForURL((url) => url.pathname.includes('flows/'), {
    waitUntil: 'domcontentloaded',
  });

  await renameFlow(page, flowName);
}
