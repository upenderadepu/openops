import { getEC2Property } from '../../src/lib/iac/ec2-properties';
import { IaCTool } from '../../src/lib/iac/iac-tool';
describe('Get EC2 Properties', () => {
  test.each(['cloudformation', 'terraform'])(
    `should return expected properties to %p`,
    async (iacTool: any) => {
      const result = getEC2Property(iacTool as IaCTool);
      expect(result).toMatchObject({
        displayName: 'Property name',
        type: 'STATIC_DROPDOWN',
        required: true,
      });
    },
  );
});
