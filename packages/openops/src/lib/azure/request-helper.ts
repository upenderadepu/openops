import { AxiosHeaders, AxiosResponse, Method } from 'axios';
import { makeHttpRequest } from '../axios-wrapper';

export function createAxiosHeadersForAzure(token: string): AxiosHeaders {
  return new AxiosHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${token}`,
  });
}

export async function makeAzurePost<T>(
  route: string,
  body: any,
  headers?: AxiosHeaders,
): Promise<T> {
  return makeAzureRequest<T>('POST', route, body, headers);
}

export async function makeAzureDelete<T>(
  route: string,
  headers?: AxiosHeaders,
): Promise<T> {
  return makeAzureRequest<T>('DELETE', route, undefined, headers);
}

export async function makeAzurePatch<T>(
  route: string,
  body: any,
  headers?: AxiosHeaders,
): Promise<T> {
  return makeAzureRequest<T>('PATCH', route, body, headers);
}

export async function makeAzureGet<T>(
  route: string,
  headers?: AxiosHeaders,
): Promise<T[]> {
  const responses: T[] = [];
  let url;

  do {
    const response: any = await makeAzureRequest<AxiosResponse>(
      'GET',
      route,
      undefined,
      headers,
      url,
    );

    if (!response) {
      break;
    }

    responses.push(response);

    if ('nextLink' in response && response.nextLink) {
      url = response.nextLink;
    } else {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return responses;
}

async function makeAzureRequest<T>(
  method: Method,
  route: string,
  body?: any,
  headers?: AxiosHeaders,
  url?: string,
): Promise<T> {
  return await makeHttpRequest(
    method,
    url ?? `https://management.azure.com/${route}`,
    headers,
    body,
  );
}
