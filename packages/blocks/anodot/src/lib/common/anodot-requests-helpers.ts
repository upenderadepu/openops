import { AxiosHeaders } from 'axios';

export function createAnodotAuthHeaders(
  authorization: string,
  apikey: string,
): AxiosHeaders {
  return new AxiosHeaders({
    'Content-Type': 'application/json',
    Authorization: authorization,
    apikey: apikey,
  });
}

export function buildUserAccountApiKey(
  apikey: string,
  accountKey: string,
  divisionId: string,
): string {
  const sanitizedApiKey = apikey.replace(/:-.*$/, '');

  return `${sanitizedApiKey}:${accountKey}:${divisionId}`;
}
