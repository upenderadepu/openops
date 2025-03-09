import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { addBlockByName } from '../utils/blocks/add-block-by-name.util';
import { addOpenopsNameAndTypeFilter } from '../utils/blocks/openops-table/add-openops-name-and-type-filter.util';
import { fillOpenOpsTableGetRecordsBlock } from '../utils/blocks/openops-table/fill-openops-table-get-records-block.util';
import { testBlock } from '../utils/blocks/test-block.util';
import { createNewFlow } from '../utils/flows/create-new-flow.util';
import { deleteFlow } from '../utils/flows/delete-flow.util';
import { authOpenOpsTable } from '../utils/openops-table/auth-openops-table.util';
import { deleteOpenopsTable } from '../utils/openops-table/delete-openops-table.util';
import { importNewOpenopsTableFromJson } from '../utils/openops-table/import-new-openops-table-from-json.util';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const openOpsTableFilters = {
  first: {
    name: 'string',
    type: 'Does not contain',
    value: '1',
    index: 0,
  },
  second: {
    name: 'emptyString',
    type: 'Is empty',
    index: 1,
  },
  third: {
    name: 'string',
    type: 'Contains',
    value: 'string',
    index: 2,
  },
};

const filterType = 'AND';

test.describe('OpenOps Table - Get Records', () => {
  const flowName = Math.random().toString();
  const tableName = Math.random().toString();

  let openOpsTablePage: Page;

  test.beforeAll(async ({ browser }) => {
    openOpsTablePage = await browser.newPage();
    await openOpsTablePage.goto(`${process.env.TABLES_URL}`);

    if (!openOpsTablePage.url().includes('dashboard')) {
      await authOpenOpsTable(openOpsTablePage, {
        email: process.env.TABLES_ADMIN_EMAIL,
        password: process.env.TABLES_ADMIN_PASSWORD,
      });
    }

    await importNewOpenopsTableFromJson(openOpsTablePage, tableName);
  });

  test.afterEach(async ({ page }) => {
    await deleteFlow(page, flowName);
    await deleteOpenopsTable(openOpsTablePage, tableName);
  });

  test('Should fill OpenOps table "Get Records" block', async ({ page }) => {
    await createNewFlow(page, flowName);

    await addBlockByName(page, {
      blockName: 'OpenOps Tables',
      actionName: 'Get Records',
    });

    await fillOpenOpsTableGetRecordsBlock(page, { tableName, filterType });

    // DO NOT convert it into loop, the test will become unstable
    await addOpenopsNameAndTypeFilter(page, openOpsTableFilters.first);
    await addOpenopsNameAndTypeFilter(page, openOpsTableFilters.second);
    await addOpenopsNameAndTypeFilter(page, openOpsTableFilters.third);

    // Check all filters to be filled
    await expect(
      page
        .getByText(
          `Field name*${openOpsTableFilters.first.name}Filter type*${openOpsTableFilters.first.type}${openOpsTableFilters.first.name}*${openOpsTableFilters.first.value}`,
        )
        .last(),
    ).toBeVisible();
    await expect(
      page
        .getByText(
          `Field name*${openOpsTableFilters.second.name}Filter type*${openOpsTableFilters.second.type}`,
        )
        .last(),
    ).toBeVisible();
    await expect(
      page
        .getByText(
          `Field name*${openOpsTableFilters.third.name}Filter type*${openOpsTableFilters.third.type}${openOpsTableFilters.third.name}*${openOpsTableFilters.third.value}`,
        )
        .last(),
    ).toBeVisible();

    // Delete the first filter
    await page.getByRole('button', { name: 'Remove' }).nth(0).click();

    //Check deleted filter to be hidden
    await expect(
      page.getByText(
        `Field name*${openOpsTableFilters.first.name}Filter type*${openOpsTableFilters.first.type}${openOpsTableFilters.first.name}*${openOpsTableFilters.first.value}`,
      ),
    ).toBeHidden();

    //Check not deleted filters to be visible
    await expect(
      page
        .getByText(
          `Field name*${openOpsTableFilters.second.name}Filter type*${openOpsTableFilters.second.type}`,
        )
        .last(),
    ).toBeVisible();
    await expect(
      page
        .getByText(
          `Field name*${openOpsTableFilters.third.name}Filter type*${openOpsTableFilters.third.type}${openOpsTableFilters.third.name}*${openOpsTableFilters.third.value}`,
        )
        .last(),
    ).toBeVisible();

    //Test block
    await testBlock(page);
  });
});
