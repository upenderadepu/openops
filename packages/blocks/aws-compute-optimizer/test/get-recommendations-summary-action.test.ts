const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getAwsAccountsMultiSelectDropdown: jest.fn().mockReturnValue({
    accounts: {
      required: true,
      defaultValue: false,
      type: 'STATIC_MULTI_SELECT_DROPDOWN',
    },
  }),
  getRecommendationSummaries: jest.fn(),
  getCredentialsListFromAuth: jest.fn(),
};

jest.mock('@openops/common', () => openopsCommonMock);

const computeOptimizerMock = {
  getRecommendationSummaries: jest.fn(),
};

jest.mock(
  '../src/lib/common/compute-optimizer-client',
  () => computeOptimizerMock,
);

import { getRecommendationsSummaryAction } from '../src/lib/actions/get-recommendations-summary-action';

describe('getRecommendationsSummaryAction', () => {
  const auth = {
    accessKeyId: 'some accessKeyId',
    secretAccessKey: 'some secretAccessKey',
    defaultRegion: 'some defaultRegion',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'some new creds',
    ]);
  });

  test('should create action with correct properties', () => {
    expect(getRecommendationsSummaryAction.props).toMatchObject({
      regions: {
        type: 'STATIC_MULTI_SELECT_DROPDOWN',
        required: true,
      },
      accounts: {
        required: true,
        type: 'STATIC_MULTI_SELECT_DROPDOWN',
      },
    });
  });

  test('should use the correct credentials with accounts', async () => {
    computeOptimizerMock.getRecommendationSummaries.mockResolvedValue([
      'mockResult',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        accounts: { accounts: ['1'] },
        regions: ['us-east-2'],
      },
    };

    const result = (await getRecommendationsSummaryAction.run(context)) as any;

    expect(result).toEqual(['mockResult']);
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      auth,
      ['1'],
    );
    expect(
      computeOptimizerMock.getRecommendationSummaries,
    ).toHaveBeenNthCalledWith(1, 'some new creds', ['us-east-2']);
  });

  test('should loop over credentials and flatten result', async () => {
    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'some new creds 1',
      'some new creds 2',
    ]);
    computeOptimizerMock.getRecommendationSummaries.mockResolvedValueOnce([
      'mockResult',
    ]);
    computeOptimizerMock.getRecommendationSummaries.mockResolvedValueOnce([
      'mockResult2',
      'mockResult3',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        accounts: { accounts: ['1', '2'] },
        regions: ['us-east-2'],
      },
    };

    const result = (await getRecommendationsSummaryAction.run(context)) as any;

    expect(result).toEqual(['mockResult', 'mockResult2', 'mockResult3']);
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      auth,
      ['1', '2'],
    );
    expect(
      computeOptimizerMock.getRecommendationSummaries,
    ).toHaveBeenCalledTimes(2);
    expect(
      computeOptimizerMock.getRecommendationSummaries,
    ).toHaveBeenNthCalledWith(1, 'some new creds 1', ['us-east-2']);
    expect(
      computeOptimizerMock.getRecommendationSummaries,
    ).toHaveBeenNthCalledWith(2, 'some new creds 2', ['us-east-2']);
  });

  test('should throw error when getRecommendationSummaries throws error', async () => {
    computeOptimizerMock.getRecommendationSummaries.mockRejectedValue(
      new Error('some error'),
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        accounts: {},
        regions: ['us-east-2'],
      },
    };

    await expect(getRecommendationsSummaryAction.run(context)).rejects.toThrow(
      'some error',
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      context.auth,
      undefined,
    );
  });
});
