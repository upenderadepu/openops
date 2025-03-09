const getAzureSubscriptionsListMock = jest.fn();
jest.mock('../../../src/lib/azure/subscription/get-subscriptions', () => ({
  getAzureSubscriptionsList: getAzureSubscriptionsListMock,
}));

const authenticateUserWithAzureMock = jest.fn();
jest.mock('../../../src/lib/azure/auth', () => ({
  authenticateUserWithAzure: authenticateUserWithAzureMock,
}));

import {
  getAzureSubscriptionsDropdown,
  getAzureSubscriptionsMultiSelectDropdown,
} from '../../../src/lib/azure/subscription/get-subscription-dropdown';

describe('get azure subscription dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return single select dropdown property with correct values', () => {
    const dropdown = getAzureSubscriptionsDropdown();
    expect(dropdown.displayName).toEqual('Subscriptions');
    expect(dropdown.description).toEqual(
      'Select a single subscription from the list',
    );
    expect(dropdown.refreshers).toEqual(['auth']);
    expect(dropdown.required).toBe(true);
    expect(dropdown.type).toEqual('DROPDOWN');
  });

  test('should have single select dropdown successfully populated', async () => {
    authenticateUserWithAzureMock.mockResolvedValue({
      access_token: 'token',
    });
    getAzureSubscriptionsListMock.mockReturnValue([
      { displayName: 'test1', subscriptionId: 'id1' },
      { displayName: 'test2', subscriptionId: 'id2' },
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    const options = await getAzureSubscriptionsDropdown().options(
      { auth: {} },
      context,
    );

    expect(authenticateUserWithAzureMock).toHaveBeenCalledTimes(1);
    expect(getAzureSubscriptionsListMock).toHaveBeenCalledTimes(1);
    expect(getAzureSubscriptionsListMock).toHaveBeenCalledWith('token');
    expect(options.disabled).toBe(false);
    expect(options.options).toEqual([
      { label: 'test1', value: 'id1' },
      { label: 'test2', value: 'id2' },
    ]);
  });

  test('should return multi select dropdown property with correct values', () => {
    const dropdown = getAzureSubscriptionsMultiSelectDropdown();
    expect(dropdown.displayName).toEqual('Subscriptions');
    expect(dropdown.description).toEqual(
      'Select one or more subscription from the list',
    );
    expect(dropdown.refreshers).toEqual(['auth']);
    expect(dropdown.required).toBe(true);
    expect(dropdown.type).toEqual('MULTI_SELECT_DROPDOWN');
  });

  test('should have multi select dropdown correctly populated', async () => {
    authenticateUserWithAzureMock.mockResolvedValue({
      access_token: 'token',
    });
    getAzureSubscriptionsListMock.mockReturnValue([
      { displayName: 'test1', subscriptionId: 'id1' },
      { displayName: 'test2', subscriptionId: 'id2' },
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    const options = await getAzureSubscriptionsMultiSelectDropdown().options(
      { auth: {} },
      context,
    );

    expect(authenticateUserWithAzureMock).toHaveBeenCalledTimes(1);
    expect(getAzureSubscriptionsListMock).toHaveBeenCalledTimes(1);
    expect(getAzureSubscriptionsListMock).toHaveBeenCalledWith('token');
    expect(options.disabled).toBe(false);
    expect(options.options).toEqual([
      { label: 'test1', value: 'id1' },
      { label: 'test2', value: 'id2' },
    ]);
  });
});
