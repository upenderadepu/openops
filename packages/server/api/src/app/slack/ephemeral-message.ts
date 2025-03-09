import {
  httpClient,
  HttpMethod,
  HttpRequest,
  HttpResponse,
} from '@openops/blocks-common';

export async function sendEphemeralMessage({
  responseUrl,
  ephemeralText,
  userId,
}: SlackEphemeralMessageParams): Promise<HttpResponse<unknown>> {
  const body = {
    text: ephemeralText,
    response_type: 'ephemeral',
    replace_original: false,
    user: userId,
  };

  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: responseUrl,
    body,
  };

  const response = await httpClient.sendRequest(request);
  return response;
}

type SlackEphemeralMessageParams = {
  responseUrl: string;
  ephemeralText: string;
  userId: string;
};
