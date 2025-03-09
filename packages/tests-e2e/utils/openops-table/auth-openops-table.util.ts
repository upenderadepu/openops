import { Page } from '@playwright/test';

export async function authOpenOpsTable(
  page: Page,
  params: { email: string; password: string },
) {
  await page.getByPlaceholder('Enter your email address..').fill(params.email);
  await page.getByPlaceholder('Enter your password..').fill(params.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}
