const commonMock = {
  getEC2Property: jest.fn(),
  getEBSProperty: jest.fn(),
  getRDSProperty: jest.fn(),
};
jest.mock('@openops/common', () => commonMock);

import { getResourceProperties } from '../../src/lib/modify/resource-properties';

describe('Get Resource Properties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    ['AWS::EC2::Instance', 1, 0, 0],
    ['AWS::EC2::Volume', 0, 1, 0],
    ['AWS::RDS::DBInstance', 0, 0, 1],
    ['other', 0, 0, 0],
  ])(
    'should return expected properties',
    async (
      type: string,
      expectedEc2: number,
      expectedEbs: number,
      expectedRds: number,
    ) => {
      const context = {
        ...jest.requireActual('@openops/blocks-framework'),
      };

      const result = getResourceProperties();
      await result.props({ logicalId: { type: type }, template: {} }, context);

      expect(result.type).toBe('DYNAMIC');

      expect(commonMock.getEC2Property).toHaveBeenCalledTimes(expectedEc2);
      expect(commonMock.getEBSProperty).toHaveBeenCalledTimes(expectedEbs);
      expect(commonMock.getRDSProperty).toHaveBeenCalledTimes(expectedRds);
    },
  );
});
