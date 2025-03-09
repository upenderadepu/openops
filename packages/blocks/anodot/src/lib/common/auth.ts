import { makeHttpRequest } from '@openops/common';
import { AxiosHeaders } from 'axios';

export interface AnodotTokens {
  Authorization: string;
  apikey: string;
}

export async function authenticateUserWithAnodot(
  authBaseUrl: string,
  username: string,
  password: string,
): Promise<AnodotTokens> {
  const authUrl = `${authBaseUrl}/credentials`;

  const body = {
    username,
    password,
  };

  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
  });

  return makeHttpRequest<AnodotTokens>('POST', authUrl, headers, body);
}
