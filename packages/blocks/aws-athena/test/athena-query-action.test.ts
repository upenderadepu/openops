const openopsCommonMock = {
  getCredentialsFromAuth: jest.fn(),
  runAndWaitForQueryResult: jest.fn(),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { runAthenaQueryAction } from '../src/lib/actions/query-athena-action';

describe('runAthenaQueryAction tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    openopsCommonMock.getCredentialsFromAuth.mockResolvedValue({
      someCreds: 'some creds',
    });
  });

  const auth = {
    accessKeyId: 'some accessKeyId',
    secretAccessKey: 'some secretAccessKey',
    defaultRegion: 'some defaultRegion',
  };

  test('should create action with correct properties', () => {
    expect(runAthenaQueryAction.props).toMatchObject({
      query: {
        required: true,
        type: 'LONG_TEXT',
      },
      outputBucket: {
        required: true,
        type: 'LONG_TEXT',
      },
      database: {
        required: true,
        type: 'DROPDOWN',
      },
      limit: {
        required: true,
        type: 'NUMBER',
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.runAndWaitForQueryResult.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        query: 'some query',
        database: 'some database',
        outputBucket: 'some outputBucket',
        limit: 10,
      },
    };

    const result = (await runAthenaQueryAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsFromAuth).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsFromAuth).toHaveBeenCalledWith(auth);
  });

  test('should throw an error when runAndWaitForQueryResult throws error', async () => {
    openopsCommonMock.runAndWaitForQueryResult.mockRejectedValue('mockError');
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        query: 'some query',
        database: 'some database',
        outputBucket: 'some outputBucket',
        limit: 10,
      },
    };

    await expect(runAthenaQueryAction.run(context)).rejects.toThrow(
      'An error occurred while running the query: mockError',
    );
  });

  test('should throw an error when database is undefined', async () => {
    openopsCommonMock.runAndWaitForQueryResult.mockRejectedValue('mockError');
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        query: 'some query',
        outputBucket: 'some outputBucket',
        limit: 10,
      },
    };

    await expect(runAthenaQueryAction.run(context)).rejects.toThrow(
      'Database is undefined.',
    );
  });

  test('should call runAndWaitForQueryResult expected input', async () => {
    openopsCommonMock.runAndWaitForQueryResult.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        query: 'some query',
        database: 'some database',
        outputBucket: 'some outputBucket',
        limit: 10,
      },
    };

    const result = (await runAthenaQueryAction.run(context)) as any;
    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.runAndWaitForQueryResult).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.runAndWaitForQueryResult).toHaveBeenCalledWith(
      { someCreds: 'some creds' },
      'some defaultRegion',
      'some query LIMIT 10',
      'some database',
      'some outputBucket',
    );
    expect(openopsCommonMock.getCredentialsFromAuth).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsFromAuth).toHaveBeenCalledWith(auth);
  });

  test.each([
    ['query LIMIT 11', 'query LIMIT 11'],
    ['query', 'query LIMIT 5'],
    ['query LIMIT not a number', 'query LIMIT not a number LIMIT 5'],
    ['query limit 11', 'query limit 11'],
    ['query liMiT 11', 'query liMiT 11'],
    [
      'query liMiT 11 is not end of query',
      'query liMiT 11 is not end of query LIMIT 5',
    ],
    ['query liMiT 11    ', 'query liMiT 11    '],
  ])(
    'should add limit depending on if exists in query',
    async (query: string, expectedResultQuery: string) => {
      openopsCommonMock.runAndWaitForQueryResult.mockResolvedValue(
        'mockResult',
      );

      const context = {
        ...jest.requireActual('@openops/blocks-framework'),
        auth: auth,
        propsValue: {
          query: query,
          database: 'some database',
          outputBucket: 'some outputBucket',
          limit: 5,
        },
      };

      (await runAthenaQueryAction.run(context)) as any;
      expect(openopsCommonMock.runAndWaitForQueryResult).toHaveBeenCalledWith(
        { someCreds: 'some creds' },
        'some defaultRegion',
        expectedResultQuery,
        'some database',
        'some outputBucket',
      );
    },
  );
});
