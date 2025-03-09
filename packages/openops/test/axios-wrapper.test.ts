const loggerMock = {
  error: jest.fn(),
};

jest.mock('@openops/server-shared', () => ({
  logger: loggerMock,
}));

const axiosMock = jest.fn();
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  __esModule: true,
  default: axiosMock,
}));

import { AxiosHeaders } from 'axios';
import { makeHttpRequest } from '../src/lib/axios-wrapper';

describe('axios request', () => {
  const header = new AxiosHeaders({ some: 'header' });

  describe('makeHttpRequest', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return data after successful post', async () => {
      axiosMock.mockResolvedValue({
        data: { test: 'some data' },
      });
      const result = await makeHttpRequest('POST', 'testUrl', header, {
        body: 'info',
      });

      expect(result).toEqual({ test: 'some data' });
      expect(axiosMock).toHaveBeenCalledWith({
        method: 'POST',
        url: 'testUrl',
        data: { body: 'info' },
        headers: header,
      });
      expect(loggerMock.error).not.toHaveBeenCalled();
    });

    test('should log an error and throw an exception on failed get', async () => {
      axiosMock.mockRejectedValue(new Error('mock error'));

      await expect(
        makeHttpRequest('PATCH', 'testUrl', header, { body: 'info' }),
      ).rejects.toThrow('mock error');

      expect(axiosMock).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'testUrl',
        data: { body: 'info' },
        headers: header,
      });
      expect(loggerMock.error).toHaveBeenCalledWith(
        `Error making HTTP request. Url: "testUrl"`,
        expect.any(Error),
      );
    });
  });
});
