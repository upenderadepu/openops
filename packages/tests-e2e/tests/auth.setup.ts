import { expect, test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const authFile = 'packages/tests-e2e/.auth/user.json';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

setup('authenticate', async ({ page }): Promise<void> => {
  await page.goto(`sign-in`);

  await page.getByPlaceholder('Email').fill(process.env.APPLICATION_EMAIL);

  await page.getByLabel('Password').fill(process.env.APPLICATION_PASSWORD);

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(
    page
      .getByRole('button', { name: 'New Workflow' })
      .or(page.getByText('Start building your first flow')),
  ).toBeVisible();

  await page.context().storageState({ path: authFile });
});
