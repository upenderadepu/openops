import { DropdownState, Property } from '@openops/blocks-framework';
import { authenticateUserWithAnodot } from './common/auth';
import { AnodotUserAccount, getAnodotUsers } from './common/users';

export function accountProperty() {
  return Property.MultiSelectDropdown({
    displayName: 'Accounts',
    description: 'A list of accounts available on Anodot.',
    refreshers: ['auth'],
    required: true,
    options: async ({ auth }: any) => {
      return getAccountDropdownState(auth);
    },
  });
}

async function getAccountDropdownState(
  auth: any,
): Promise<DropdownState<unknown>> {
  if (!auth) {
    return {
      disabled: true,
      options: [],
      placeholder: 'Please authenticate first',
    };
  }

  try {
    const anodotTokens = await authenticateUserWithAnodot(
      auth.authUrl,
      auth.username,
      auth.password,
    );

    const user = await getAnodotUsers(auth.apiUrl, anodotTokens);

    if (!user || !user.accounts || user.accounts.length === 0) {
      return {
        disabled: true,
        options: [],
        placeholder: 'Anodot user accounts is empty.',
      };
    }

    return {
      disabled: false,
      options: user.accounts.map((account: AnodotUserAccount) => ({
        label: account.accountName,
        value: {
          accountId: account.accountId,
          accountKey: account.accountKey,
          divisionId: account.divisionId,
          accountName: account.accountName,
        },
      })),
    };
  } catch (error) {
    return {
      disabled: true,
      options: [],
      placeholder:
        'Could not fetch Anodot user accounts: ' + (error as Error).message,
    } as DropdownState<unknown>;
  }
}
