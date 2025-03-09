import { IaCTool } from '../../src/lib/iac/iac-tool';
import { getRDSProperty } from '../../src/lib/iac/rds-properties';

describe('Get RDS Properties', () => {
  test.each(['cloudformation', 'terraform'])(
    `should return expected properties to %p`,
    async (iacTool: any) => {
      const result = getRDSProperty(iacTool as IaCTool);
      expect(result).toMatchObject({
        displayName: 'Property name',
        type: 'STATIC_DROPDOWN',
        required: true,
      });
    },
  );
});
