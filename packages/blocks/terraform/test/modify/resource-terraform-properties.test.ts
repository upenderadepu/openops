const commonMock = {
  getEC2Property: jest.fn(),
  getEBSProperty: jest.fn(),
  getRDSProperty: jest.fn(),
};
jest.mock('@openops/common', () => commonMock);

import { getTerraformResourceProperties } from '../../src/lib/modify/resource-terraform-properties';

describe('Get Resource Properties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    ['{"name": "example", "type": "aws_instance"}', 1, 0, 0],
    ['{"name": "example", "type": "aws_ebs_volume"}', 0, 1, 0],
    ['{"name": "example", "type": "aws_db_instance"}', 0, 0, 1],
    ['{"name": "example", "type": "other"}', 0, 0, 0],
    [{ name: 'example', type: 'aws_instance' }, 1, 0, 0],
    [{ name: 'example', type: 'aws_ebs_volume' }, 0, 1, 0],
    [{ name: 'example', type: 'aws_db_instance' }, 0, 0, 1],
    [{ name: 'example', type: 'other' }, 0, 0, 0],
  ])(
    'should return expected properties when use resourceNameAndType is %p',
    async (
      input: any,
      expectedEc2: number,
      expectedEbs: number,
      expectedRds: number,
    ) => {
      const context = {
        ...jest.requireActual('@openops/blocks-framework'),
      };

      const result = getTerraformResourceProperties();
      await result.props({ resourceNameAndType: input, template: {} }, context);

      expect(result.type).toBe('DYNAMIC');

      expect(commonMock.getEC2Property).toHaveBeenCalledTimes(expectedEc2);
      expect(commonMock.getEBSProperty).toHaveBeenCalledTimes(expectedEbs);
      expect(commonMock.getRDSProperty).toHaveBeenCalledTimes(expectedRds);
    },
  );
});
