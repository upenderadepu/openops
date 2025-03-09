import { makeHttpRequest } from '@openops/common';
import { createAnodotAuthHeaders } from './anodot-requests-helpers';
import { AnodotTokens } from './auth';

export interface AnodotUser {
  id: number;
  user_key: string;
  user_name: string;
  user_display_name: string;
  user_type: string;
  accounts: AnodotUserAccount[];
}

export interface AnodotUserAccount {
  accountKey: number;
  accountId: string;
  accountTypeId: number;
  accountName: string;
  divisionId: number;
}

export async function getAnodotUsers(
  apiUrl: string,
  tokens: AnodotTokens,
): Promise<AnodotUser> {
  const url = `${apiUrl}/v1/users`;

  const headers = createAnodotAuthHeaders(tokens.Authorization, tokens.apikey);

  return makeHttpRequest<AnodotUser>('GET', url, headers);
}
