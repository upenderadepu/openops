import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { addBlockByName } from '../utils/blocks/add-block-by-name.util';
import { addAwsNameAndValueFilter } from '../utils/blocks/aws/add-aws-name-and-value-filter.util';
import { fillAwsGetPriceBlock } from '../utils/blocks/aws/fill-aws-get-price-block.util';
import { testBlock } from '../utils/blocks/test-block.util';
import { createNewFlow } from '../utils/flows/create-new-flow.util';
import { deleteFlow } from '../utils/flows/delete-flow.util';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const awsGetPriceBaseValues = {
  connectionName: 'aws',
  serviceCode: 'AmazonEC2',
};

const awsFilters = {
  first: {
    name: 'instanceCapacityMetal',
    value: '1',
    index: 0,
  },
  second: {
    name: 'instanceType',
    value: 'c5.large',
    index: 1,
  },
  third: {
    name: 'operatingSystem',
    value: 'Linux',
    index: 2,
  },
};

test.describe('AWS - Get Price', () => {
  const flowName = Math.random().toString();

  test.afterEach(async ({ page }) => {
    await deleteFlow(page, flowName);
  });

  test('Should fill AWS "Get Price from Price Catalog" block', async ({
    page,
  }) => {
    await createNewFlow(page, flowName);

    await addBlockByName(page, {
      blockName: 'AWS',
      actionName: 'Get Price from Price Catalog',
    });

    await fillAwsGetPriceBlock(page, {
      connectionName: awsGetPriceBaseValues.connectionName,
      serviceCode: awsGetPriceBaseValues.serviceCode,
    });

    //DO NOT convert it into loop, the test will become unstable
    await addAwsNameAndValueFilter(page, awsFilters.first);
    await addAwsNameAndValueFilter(page, awsFilters.second);
    await addAwsNameAndValueFilter(page, awsFilters.third);

    //Check all filters to be filled
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.first.name}Attribute value*${awsFilters.first.value}`,
      ),
    ).toBeAttached();
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.second.name}Attribute value*${awsFilters.second.value}`,
      ),
    ).toBeAttached();
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.third.name}Attribute value*${awsFilters.third.value}`,
      ),
    ).toBeAttached();

    //Delete the first filter
    await page.getByRole('button', { name: 'Remove' }).nth(0).click();

    //Check deleted filter to be hidden
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.first.name}Attribute value*${awsFilters.first.value}`,
      ),
    ).toBeHidden();

    // //Check not deleted filters to be visible
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.second.name}Attribute value*${awsFilters.second.value}`,
      ),
    ).toBeAttached();
    await expect(
      page.getByText(
        `Attribute name*${awsFilters.third.name}Attribute value*${awsFilters.third.value}`,
      ),
    ).toBeAttached();

    //Test block
    await testBlock(page);
  });
});
