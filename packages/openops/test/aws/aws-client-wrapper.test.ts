import { makeAwsRequest } from '../../src/lib/aws/aws-client-wrapper';

describe('makeAwsRequest tests', () => {
  test('should return empty array if client.send returns no result', async () => {
    const client = {
      send: jest.fn().mockResolvedValue(undefined),
    };
    const command = { some: 'args' };

    const results = await makeAwsRequest(client, command);

    expect(results).toEqual([]);

    expect(client.send).toHaveBeenCalledTimes(1);
    expect(client.send).toHaveBeenCalledWith(command);
  });

  test('should return 1 result if there is no next token', async () => {
    const client = {
      send: jest.fn().mockResolvedValue({ some: 'result' }),
    };
    const command = { some: 'args' };

    const results = await makeAwsRequest(client, command);

    expect(results).toEqual([{ some: 'result' }]);

    expect(client.send).toHaveBeenCalledTimes(1);
    expect(client.send).toHaveBeenCalledWith(command);
  });

  test('should return multiple results if there is a next token', async () => {
    const response1 = { some: 'result1', nextToken: 'someToken1' };
    const response2 = { some: 'result2', nextToken: 'someToken2' };
    const response3 = { some: 'result3' };
    const calls: any[] = [];

    function mockSend(response: any) {
      return (args: any) => {
        calls.push(JSON.parse(JSON.stringify(args)));
        return Promise.resolve(response);
      };
    }

    const client = {
      send: jest
        .fn()
        .mockImplementationOnce(mockSend(response1))
        .mockImplementationOnce(mockSend(response2))
        .mockImplementationOnce(mockSend(response3)),
    };

    const command = { some: 'args', input: { some: 'input' } };

    const results = await makeAwsRequest(client, command);

    expect(results).toEqual([response1, response2, response3]);

    expect(client.send).toHaveBeenCalledTimes(3);
    expect(calls).toEqual([
      { some: 'args', input: { some: 'input' } },
      { some: 'args', input: { some: 'input', nextToken: 'someToken1' } },
      { some: 'args', input: { some: 'input', nextToken: 'someToken2' } },
    ]);
  });

  test.each([null, undefined, ''])(
    'should not get stuck in infinite loop if next token field exists but is null or undefined',
    async (nextToken) => {
      const client = {
        send: jest.fn().mockResolvedValue({ some: 'result', nextToken }),
      };
      const command = { some: 'args' };

      const results = await makeAwsRequest(client, command);

      expect(results).toEqual([{ some: 'result', nextToken }]);

      expect(client.send).toHaveBeenCalledTimes(1);
      expect(client.send).toHaveBeenCalledWith(command);
    },
  );
});
