import { Filter } from '@aws-sdk/client-pricing';
import {
  AuthenticationType,
  httpClient,
  HttpMethod,
  HttpRequest,
} from '@openops/blocks-common';

export async function getPriceListFromClient(
  serverBaseUrl: string,
  token: string,
  priceRegion: string,
  serviceCode: string,
  filters: Filter[],
) {
  const url = new URL('v1/pricing', serverBaseUrl).toString();
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${url}/?serviceCode=${serviceCode}&filters=${JSON.stringify(
      filters,
    )}&region=${priceRegion}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: token,
    },
  };

  return (await httpClient.sendRequest(request)).body;
}
