import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: +process.env.E2E_TESTS_TIMEOUT,
  expect: {
    timeout: +process.env.E2E_TESTS_EXPECT_TIMEOUT,
  },
  use: {
    baseURL: process.env.APPLICATION_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './packages/tests-e2e/.auth/user.json',
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ['setup'],
    },
  ],
  reporter: [['html', { outputFolder: '../../test-results/e2e' }]],
});
