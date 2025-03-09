// https://cost-docs.anodot.com/#add-update-and-remove-comments-from-a-recommendation

import { makeHttpRequest } from '@openops/common';
import { createAnodotAuthHeaders } from './anodot-requests-helpers';

export interface CreateCommentResponse {
  comment: string;
  commentId: number;
  createdAt: number;
  createdBy: string;
  createdByDisplayName: string;
}

const buildEndpointUrl = (apiUrl: string, recommendationId: string) =>
  `${apiUrl}/v2/recommendations/${recommendationId}/comments`;

export async function addRecommendationComment(
  apiUrl: string,
  authorizationToken: string,
  accountApiKey: string,
  recommendationId: string,
  comment: string,
): Promise<CreateCommentResponse> {
  const url = buildEndpointUrl(apiUrl, recommendationId);
  const headers = createAnodotAuthHeaders(authorizationToken, accountApiKey);

  const body = {
    createdBy: 'OpenOps',
    comment: comment,
  };

  const response = await makeHttpRequest<CreateCommentResponse>(
    'POST',
    url,
    headers,
    body,
  );

  return response;
}

export async function updateRecommendationComment(
  apiUrl: string,
  authorizationToken: string,
  accountApiKey: string,
  recommendationId: string,
  commentId: string,
  comment: string,
): Promise<any> {
  const url = buildEndpointUrl(apiUrl, recommendationId);
  const headers = createAnodotAuthHeaders(authorizationToken, accountApiKey);

  const body = {
    comment: comment,
    commentId: commentId,
  };

  const response = await makeHttpRequest<any>('PUT', url, headers, body);

  return response;
}

export async function deleteRecommendationComment(
  apiUrl: string,
  authorizationToken: string,
  accountApiKey: string,
  recommendationId: string,
  commentId: string,
): Promise<any> {
  const url = buildEndpointUrl(apiUrl, recommendationId);
  const headers = createAnodotAuthHeaders(authorizationToken, accountApiKey);
  const body = {
    commentId: commentId,
  };

  const response = await makeHttpRequest<any>('DELETE', url, headers, body);

  return response;
}
