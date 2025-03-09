jest.mock('@aws-sdk/client-rds');
import * as RDS from '@aws-sdk/client-rds';

const mockClient = {
  ...jest.requireActual('@aws-sdk/client-rds'),
  send: jest.fn(),
};

(RDS.RDS as jest.MockedFunction<any>).mockImplementation(() => mockClient);

const getAwsClientMock = {
  getAwsClient: jest.fn(),
};

jest.mock('../../../src/lib/aws/get-client', () => getAwsClientMock);

import {
  describeRdsInstances,
  describeRdsSnapshots,
} from '../../../src/lib/aws/rds/rds-describe';

describe('describeRdsSnapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct results for regions %p', async () => {
    const sendMock = jest
      .fn()
      .mockResolvedValueOnce({ DBSnapshots: [{ obj: '1' }] })
      .mockResolvedValueOnce({ DBSnapshots: [{ obj: '2' }] });

    getAwsClientMock.getAwsClient.mockImplementation(() => ({
      send: sendMock,
    }));

    const filters = [{ Name: 'some filter', Values: ['some value'] }];
    const result = await describeRdsSnapshots(
      'credentials',
      ['some-region1', 'some-region2'],
      filters,
    );

    expect(getAwsClientMock.getAwsClient).toBeCalledTimes(2);
    expect(getAwsClientMock.getAwsClient).toBeCalledWith(
      RDS.RDS,
      'credentials',
      'some-region1',
    );
    expect(getAwsClientMock.getAwsClient).toBeCalledWith(
      RDS.RDS,
      'credentials',
      'some-region2',
    );
    expect(result).toStrictEqual([
      { obj: '1', region: 'some-region1' },
      { obj: '2', region: 'some-region2' },
    ]);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  test(`should throw if send throws`, async () => {
    const sendMock = jest.fn().mockRejectedValue(new Error('some error'));
    getAwsClientMock.getAwsClient.mockImplementation(() => ({
      send: sendMock,
    }));

    await expect(
      describeRdsInstances('credentials', ['some-region1'], []),
    ).rejects.toThrow('some error');
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});

describe('describeRdsInstances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct results for regions %p', async () => {
    const sendMock = jest
      .fn()
      .mockResolvedValueOnce({ DBInstances: [{ instance: 'instance1' }] })
      .mockResolvedValueOnce({ DBInstances: [{ instance: 'instance2' }] });

    getAwsClientMock.getAwsClient.mockImplementation(() => ({
      send: sendMock,
    }));

    const filters = [{ Name: 'some filter', Values: ['some value'] }];
    const result = await describeRdsInstances(
      'credentials',
      ['some-region1', 'some-region2'],
      filters,
    );

    expect(getAwsClientMock.getAwsClient).toBeCalledTimes(2);
    expect(getAwsClientMock.getAwsClient).toBeCalledWith(
      RDS.RDS,
      'credentials',
      'some-region1',
    );
    expect(getAwsClientMock.getAwsClient).toBeCalledWith(
      RDS.RDS,
      'credentials',
      'some-region2',
    );
    expect(result).toStrictEqual([
      { instance: 'instance1', region: 'some-region1' },
      { instance: 'instance2', region: 'some-region2' },
    ]);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  test(`should throw if send throws`, async () => {
    const sendMock = jest.fn().mockRejectedValue(new Error('some error'));
    getAwsClientMock.getAwsClient.mockImplementation(() => ({
      send: sendMock,
    }));

    await expect(
      describeRdsInstances('credentials', ['some-region1'], []),
    ).rejects.toThrow('some error');
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
