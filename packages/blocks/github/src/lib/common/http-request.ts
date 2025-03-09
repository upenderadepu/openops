import {
  AuthenticationType,
  httpClient,
  HttpMethod,
  HttpRequest,
} from '@openops/blocks-common';
import { OAuth2PropertyValue } from '@openops/blocks-framework';
import { logger } from '@openops/server-shared';

export async function makeRequest<T>(params: RequestParams): Promise<T> {
  const request = createHttpRequest(params);

  const response = await httpClient.sendRequest<T>(request);

  return response.body;
}

export async function makePaginatedRequest<T extends unknown[]>(
  params: RequestParams,
): Promise<T> {
  /**
   * Based on https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#scripting-with-pagination
   */
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  let pagesRemaining = true;
  const data = [];

  const request = createHttpRequest(params);
  request.queryParams = {
    ...params.queryParams,
    per_page: params.queryParams?.['per_page'] || '100',
  };

  while (pagesRemaining) {
    const response = await httpClient.sendRequest<T>(request);

    data.push(...response.body);

    const linkHeader =
      (response.headers?.['link'] as string | undefined) ?? undefined;

    if (!linkHeader) {
      return data as T;
    }

    pagesRemaining = linkHeader.includes(`rel="next"`);

    if (pagesRemaining) {
      const match = linkHeader.match(nextPattern);
      if (match?.[0]) {
        request.url = match[0];
      } else {
        logger.warn('The url for the next page was not found.', {
          responseHeader: linkHeader,
        });
        return data as T;
      }
    }
  }

  return data as T;
}

function createHttpRequest(params: RequestParams): HttpRequest {
  return {
    method: params.httpMethod,
    url: `https://api.github.com/${params.url}`,
    queryParams: params.queryParams,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: params.authProp.access_token,
    },
    body: params.body,
    headers: params.headers,
  };
}

interface RequestParams {
  url: string;
  httpMethod: HttpMethod;
  queryParams?: Record<string, string>;
  authProp: OAuth2PropertyValue;
  body?: any;
  headers?: any;
}
