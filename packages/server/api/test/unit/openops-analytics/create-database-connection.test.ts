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

import { getOrCreatePostgresDatabaseConnection } from '../../../src/app/openops-analytics/create-database-connection';

describe('createPostgresSqlDatabaseConnectionIfDoesntExist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return database after succesful creation', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 1,
      result: { someProp: 'mock database connection' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await getOrCreatePostgresDatabaseConnection(
      'some token',
      'some dbName',
      'some dbPassword',
      'some dbPort',
      'some dbUserName',
      'some dbHost',
      'some connectionName',
    );

    expect(result).toEqual({ id: 1, someProp: 'mock database connection' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'database',
      {
        database_name: 'some connectionName',
        sqlalchemy_uri:
          'postgresql://some dbUserName:some dbPassword@some dbHost:some dbPort/some dbName',
        expose_in_sqllab: true,
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

  test('should return database connection if it already exists', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsGet.mockResolvedValue({
      result: [{ id: 1, someOtherProp: 'some database connection' }],
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );
    axiosMock.isAxiosError.mockReturnValue(false);

    const result = await getOrCreatePostgresDatabaseConnection(
      'some token',
      'some dbName',
      'some dbPassword',
      'some dbPort',
      'some dbUserName',
      'some dbHost',
      'some connectionName',
    );

    expect(result).toEqual({
      id: 1,
      someOtherProp: 'some database connection',
    });
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      `database?q=(filters:!((col:database_name,opr:eq,value:'some connectionName')))`,
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
