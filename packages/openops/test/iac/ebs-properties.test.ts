import { getEBSProperty } from '../../src/lib/iac/ebs-properties';
import { IaCTool } from '../../src/lib/iac/iac-tool';

describe('Get EBS Properties', () => {
  test.each(['cloudformation', 'terraform'])(
    `should return expected properties to %p`,
    async (iacTool: any) => {
      const result = getEBSProperty(iacTool as IaCTool);
      expect(result).toMatchObject({
        displayName: 'Property name',
        type: 'STATIC_DROPDOWN',
        required: true,
      });
    },
  );
});
