const httpClientMock = {
  sendRequest: jest.fn(),
};

const common = {
  ...jest.requireActual('@openops/blocks-common'),
  httpClient: httpClientMock,
};

jest.mock('@openops/blocks-common', () => common);

import { Filter } from '@aws-sdk/client-pricing';
import { AuthenticationType, HttpMethod } from '@openops/blocks-common';
import { getPriceListFromClient } from '../../src/lib/aws/pricing-http-client';
const SERVER_BASE_URL = 'http://aurl.com/';
const USER_TOKEN = 'some token';

describe('getPriceListFromCache', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should execute http request and return correct results', async () => {
    httpClientMock.sendRequest.mockReturnValue({ body: 'mock result' });

    const filters = [{ Value: 'mock filter' }] as unknown as Filter[];
    const result = await getPriceListFromClient(
      SERVER_BASE_URL,
      USER_TOKEN,
      'region',
      'mock service code',
      filters,
    );

    expect(result).toStrictEqual('mock result');
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: 'http://aurl.com/v1/pricing/?serviceCode=mock service code&filters=[{"Value":"mock filter"}]&region=region',
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some token',
      },
    });
  });
});
