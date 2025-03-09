const loggerMock = {
  info: jest.fn(),
};
jest.mock('@openops/server-shared', () => ({
  ...jest.requireActual('@openops/server-shared'),
  logger: loggerMock,
}));

const axiosMock = {
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
};
jest.mock('axios', () => axiosMock);

const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  createAxiosHeadersForAnalytics: jest.fn(),
  makeOpenOpsAnalyticsPost: jest.fn(),
  makeOpenOpsAnalyticsGet: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { getOrCreateDataset } from '../../../src/app/openops-analytics/create-dataset';

describe('getOrCreateDataset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return dataset after succesful creation', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 1,
      result: { someOtherProperty: 'mock dataset' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await getOrCreateDataset(
      'some token',
      'some table name',
      1,
      'some schema name',
    );

    expect(result).toEqual({ id: 1, someOtherProperty: 'mock dataset' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'dataset',
      {
        database: 1,
        table_name: 'some table name',
        schema: 'some schema name',
      },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
  });

  test('should return database if it already exists', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsGet.mockResolvedValue({
      result: [{ id: 1, otherProperty: 'some dataset' }],
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );
    axiosMock.isAxiosError.mockReturnValue(false);

    const result = await getOrCreateDataset(
      'some token',
      'some table name',
      1,
      'some schema name',
    );

    expect(result).toEqual({ id: 1, otherProperty: 'some dataset' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      `dataset?q=(filters:!((col:table_name,opr:eq,value:'some table name')))`,
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).not.toHaveBeenCalled();
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
  });
});
