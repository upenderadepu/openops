import {
  BlockPropValueSchema,
  DropdownOption,
  Property,
} from '@openops/blocks-framework';
import { databricksAuth } from './auth';
import { getDatabricksToken } from './get-databricks-token';
import { makeDatabricksHttpRequest } from './make-databricks-http-request';

export const warehouseId = Property.Dropdown({
  displayName: 'Warehouse',
  description:
    'Specifies which SQL warehouse in your Databricks workspace should be used to run the query. You must have access to this warehouse.',
  refreshers: ['workspaceDeploymentName'],
  required: true,
  options: async ({ auth, workspaceDeploymentName }) => {
    if (!workspaceDeploymentName) {
      return {
        disabled: true,
        placeholder: 'Please select a workspace',
        options: [],
      };
    }
    try {
      const authValue = auth as BlockPropValueSchema<typeof databricksAuth>;
      const accessToken = await getDatabricksToken(authValue);

      const { warehouses } = await makeDatabricksHttpRequest<{
        warehouses: any[];
      }>({
        deploymentName: workspaceDeploymentName as string,
        token: accessToken,
        method: 'GET',
        path: '/api/2.0/sql/warehouses',
      });

      const options: DropdownOption<string>[] = warehouses.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
      }));

      return {
        disabled: false,
        options: options,
      };
    } catch (error: any) {
      return {
        disabled: true,
        placeholder: 'An error occurred while fetching warehouses',
        error: error?.message,
        options: [],
      };
    }
  },
});
