const sendRequestMock = jest.fn();
import { AuthenticationType, HttpMethod } from '@openops/blocks-common';
import { JiraUser, searchUserByCriteria } from '../../src/lib/common/index';

jest.mock('@openops/blocks-common', () => ({
  ...jest.requireActual('@openops/blocks-common'),
  httpClient: { sendRequest: sendRequestMock },
}));

describe('searchUserByCriteria', () => {
  const auth = {
    instanceUrl: 'some url',
    email: 'some email',
    apiToken: 'some api token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const emailToTest = 'test@mail.com';
  const expectedRequest = {
    url: `user/search?query=${emailToTest}`,
    method: HttpMethod.GET,
    auth: auth,
  };

  test('should throw an error when the request fails', async () => {
    sendRequestMock.mockRejectedValue(new Error('error with something'));

    await expect(() =>
      searchUserByCriteria(auth, 'test@mail.com'),
    ).rejects.toThrow('error with something');
    expect(sendRequestMock).toHaveBeenCalledTimes(1);
    expect(sendRequestMock).toHaveBeenCalledWith({
      ...expectedRequest,
      url: `${expectedRequest.auth.instanceUrl}/rest/api/3/${expectedRequest.url}`,
      authentication: {
        type: AuthenticationType.BASIC,
        username: expectedRequest.auth.email,
        password: expectedRequest.auth.apiToken,
      },
    });
  });

  const jiraUserResponse = {
    accountId: '123',
    accountType: 'accountType',
    active: true,
    displayName: 'displayName',
    emailAddress: 'emailAddress',
    locate: 'locate',
    self: 'self',
    timeZone: 'timeZone',
  };

  test.each([[[]], [[jiraUserResponse]]])(
    'should return the response=%p from Jira API',
    async (expectedResult: any) => {
      sendRequestMock.mockResolvedValue({
        status: 200,
        headers: {
          random: 'header',
        },
        body: expectedResult,
      });

      const result = await searchUserByCriteria(auth, emailToTest);

      expect(result).toEqual(expectedResult as JiraUser[]);
      expect(sendRequestMock).toHaveBeenCalledTimes(1);
      expect(sendRequestMock).toHaveBeenCalledWith({
        ...expectedRequest,
        url: `${expectedRequest.auth.instanceUrl}/rest/api/3/${expectedRequest.url}`,
        authentication: {
          type: AuthenticationType.BASIC,
          username: expectedRequest.auth.email,
          password: expectedRequest.auth.apiToken,
        },
      });
    },
  );
});
