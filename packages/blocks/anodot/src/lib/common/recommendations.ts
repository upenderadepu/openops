import { makeHttpRequest } from '@openops/common';
import { createAnodotAuthHeaders } from './anodot-requests-helpers';
import { RecommendationsRequestFilters } from './recommendations-request-filters';

export interface PaginationToken {
  recId: number;
  createdAt: string;
}

interface RecommendationsRequest {
  page_size: number;
  pagination_token?: PaginationToken;
  sort: { by: string; order: string }[];
  filters: RecommendationsRequestFilters;
}

interface RecommendationsResponse {
  page: any[];
  total: number;
  isLastPage: boolean;
  paginationToken: PaginationToken;
}

export async function getAnodotRecommendations(
  apiUrl: string,
  authorizationToken: string,
  accountApiKey: string,
  filters: RecommendationsRequestFilters,
): Promise<any> {
  const url = `${apiUrl}/v2/recommendations/list`;

  const headers = createAnodotAuthHeaders(authorizationToken, accountApiKey);

  let paginationToken;

  const recommendations = [];

  do {
    const body: RecommendationsRequest = {
      filters,
      page_size: 500,
      sort: [{ by: 'savings', order: 'desc' }],
      pagination_token: paginationToken,
    };

    const response = await makeHttpRequest<RecommendationsResponse>(
      'POST',
      url,
      headers,
      body,
    );

    if (!response) {
      break;
    }

    recommendations.push(...response.page);

    if (response.isLastPage) {
      break;
    }

    paginationToken = response.paginationToken;
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return recommendations;
}

export async function setUserStatusForRecommendation(
  apiUrl: string,
  authorizationToken: string,
  accountApiKey: string,
  recommendationId: string,
  action: string,
  actionParams?: any,
): Promise<any> {
  const url = `${apiUrl}/v2/recommendations/user-action`;

  const headers = createAnodotAuthHeaders(authorizationToken, accountApiKey);

  const body = {
    action: action,
    recId: recommendationId,
    actionParams: actionParams,
  };

  const response = await makeHttpRequest<any>('POST', url, headers, body);

  return response;
}
