import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { deleteFlow } from '../utils/flows/delete-flow.util';
import { importFlow } from '../utils/flows/import-flow.util';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function expectItemsToBeVisible(page: Page, treeViewItemNames: string[]) {
  for (const name of treeViewItemNames) {
    await expect(page.getByRole('treeitem', { name })).toBeVisible();
  }
}

async function expectItemsNotToBeVisible(
  page: Page,
  treeViewItemNames: string[],
) {
  for (const name of treeViewItemNames) {
    await expect(page.getByRole('treeitem', { name })).not.toBeVisible();
  }
}
const nestedActionNames = {
  blockInLoop: 'Block in loop',
  blockInSplit1Branch: 'Block in split 1 branch',
  blockInConditionFalseBranch: 'Block in condition false branch',
  blockInConditionTrueBranch: 'Block in condition true branch',
  blockInSplit2Branch: 'Block in split 2 branch',
  blockInSplit3Branch: 'Block in split 3 branch',
};

const actionNames = {
  topLevelBlock: 'Top level block',
  ...nestedActionNames,
};

test.describe('Workflow tree view', () => {
  const flowName = Math.random().toString();

  test.beforeEach(async ({ page }) => {
    await importFlow(
      page,
      flowName,
      path.join(
        __dirname,
        '../assets/workflow-with-all-simple-nested-blocks.json',
      ),
    );
    await page.getByTestId('toggleTreeViewButton').click();
    await expect(page.getByText('Tree View')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.getByTestId('toggleTreeViewButton').click();
    await expect(page.getByText('Tree View')).not.toBeVisible();
    await deleteFlow(page, flowName);
  });

  test('Should expand and collapse all items', async ({ page }) => {
    await page.getByTestId('toggleAllTreeViewItemsButton').click();
    await expectItemsToBeVisible(page, Object.values(actionNames));

    await page.getByTestId('toggleAllTreeViewItemsButton').click();
    await expectItemsNotToBeVisible(page, Object.values(nestedActionNames));
    await expect(
      page.getByRole('treeitem', { name: actionNames.topLevelBlock }),
    ).toBeVisible();
  });

  test('Should select deeply nested block', async ({ page }) => {
    await page.getByText(actionNames.blockInConditionTrueBranch).click();

    await expect(
      page.getByRole('treeitem', {
        name: actionNames.blockInConditionTrueBranch,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('treeitem', { name: actionNames.topLevelBlock }),
    ).toBeVisible();
    await expect(
      page.getByRole('treeitem', {
        name: actionNames.blockInConditionFalseBranch,
      }),
    ).not.toBeVisible();
    await expect(
      page.getByRole('treeitem', { name: actionNames.blockInSplit2Branch }),
    ).not.toBeVisible();
    await expect(
      page.getByRole('treeitem', { name: actionNames.blockInSplit3Branch }),
    ).not.toBeVisible();
  });

  test('Should save tree view state after sidebar closing', async ({
    page,
  }) => {
    await page.getByTestId('toggleAllTreeViewItemsButton').click();

    await expectItemsToBeVisible(page, Object.values(actionNames));

    await page.getByTestId('toggleTreeViewButton').click();

    await page.getByTestId('toggleHistoryButton').click();
    await expect(page.getByText('Version History')).toBeVisible();
    await page.getByTestId('toggleHistoryButton').click();
    await expect(page.getByText('Version History')).not.toBeVisible();

    await page.getByTestId('toggleTreeViewButton').click();

    await expectItemsToBeVisible(page, Object.values(actionNames));
  });

  test('Should save tree view state after parent node collapsing', async ({
    page,
  }) => {
    await page.getByTestId('toggleAllTreeViewItemsButton').click();

    await expectItemsToBeVisible(page, Object.values(actionNames));

    await page
      .getByRole('treeitem', { name: 'Loop on items' })
      .getByTestId('treeViewItemCollapsibleToggle')
      .first()
      .click();

    await expectItemsNotToBeVisible(page, Object.values(nestedActionNames));

    await page
      .getByRole('treeitem', { name: 'Loop on items' })
      .getByTestId('treeViewItemCollapsibleToggle')
      .first()
      .click();

    await expectItemsToBeVisible(page, Object.values(actionNames));
  });

  test('Should open block settings from the tree view', async ({ page }) => {
    await page.getByTestId('toggleAllTreeViewItemsButton').click();

    await page
      .getByRole('treeitem', { name: actionNames.blockInConditionTrueBranch })
      .getByRole('button')
      .click();

    await expect(
      page
        .locator('#right-sidebar')
        .getByText(actionNames.blockInConditionTrueBranch),
    ).toBeVisible();
  });
});
