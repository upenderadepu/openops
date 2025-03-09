const httpRequestMock = jest.fn();
jest.mock('../../src/lib/axios-wrapper', () => ({
  makeHttpRequest: httpRequestMock,
}));

import { AxiosHeaders } from 'axios';
import {
  makeAzureDelete,
  makeAzureGet,
  makeAzurePatch,
  makeAzurePost,
} from '../../src/lib/azure/request-helper';

describe('azure request helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const header = new AxiosHeaders({ some: 'header' });

  test('should return data after get', async () => {
    httpRequestMock.mockResolvedValue({ next: undefined });

    const result = await makeAzureGet('test/route/api', header);

    expect(result).toEqual([{ next: undefined }]);
    expect(httpRequestMock).toHaveBeenCalledWith(
      'GET',
      'https://management.azure.com/test/route/api',
      header,
      undefined,
    );
  });

  test('should return data after patch', async () => {
    httpRequestMock.mockResolvedValue('mockResult');

    const result = await makeAzurePatch(
      'test/route/api',
      { body: 'info' },
      header,
    );

    expect(result).toEqual('mockResult');
    expect(httpRequestMock).toHaveBeenCalledWith(
      'PATCH',
      'https://management.azure.com/test/route/api',
      header,
      { body: 'info' },
    );
  });

  test('should return data after delete', async () => {
    httpRequestMock.mockResolvedValue('mockResult');

    const result = await makeAzureDelete('test/route/api', header);

    expect(result).toEqual('mockResult');
    expect(httpRequestMock).toHaveBeenCalledWith(
      'DELETE',
      'https://management.azure.com/test/route/api',
      header,
      undefined,
    );
  });

  test('should return data after post', async () => {
    httpRequestMock.mockResolvedValue('mockResult');

    const result = await makeAzurePost(
      'test/route/api',
      { body: 'info' },
      header,
    );

    expect(result).toEqual('mockResult');
    expect(httpRequestMock).toHaveBeenCalledWith(
      'POST',
      'https://management.azure.com/test/route/api',
      header,
      { body: 'info' },
    );
  });

  test('Should return all pages for paginated request.', async () => {
    httpRequestMock
      .mockResolvedValueOnce({
        test: 'some data one',
        nextLink: 'next url',
      })
      .mockResolvedValueOnce({
        test: 'some data two',
        nextLink: 'next url two',
      })
      .mockResolvedValueOnce({
        test: 'some data three',
      });
    const result = await makeAzureGet('test/route/api', header);

    expect(result).toEqual([
      { test: 'some data one', nextLink: 'next url' },
      { test: 'some data two', nextLink: 'next url two' },
      { test: 'some data three' },
    ]);
    expect(httpRequestMock).toHaveBeenNthCalledWith(
      1,
      'GET',
      'https://management.azure.com/test/route/api',
      header,
      undefined,
    );

    expect(httpRequestMock).toHaveBeenNthCalledWith(
      2,
      'GET',
      'next url',
      header,
      undefined,
    );

    expect(httpRequestMock).toHaveBeenNthCalledWith(
      3,
      'GET',
      'next url two',
      header,
      undefined,
    );
  });
});
