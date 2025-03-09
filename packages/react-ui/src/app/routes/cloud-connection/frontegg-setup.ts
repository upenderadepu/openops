import { initialize } from '@frontegg/js';

export const additionalFronteggParams = {
  // Google OAuth 2.0: Prompt the user to select an account. https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
  prompt: 'select_account',
};

export const initializeFrontegg = (
  FRONTEGG_URL: string,
  FRONTEGG_CLIENT_ID: string,
  FRONTEGG_APP_ID: string,
) =>
  initialize({
    contextOptions: {
      baseUrl: FRONTEGG_URL as string,
      clientId: FRONTEGG_CLIENT_ID as string,
      appId: FRONTEGG_APP_ID as string,
    },
    authOptions: {
      keepSessionAlive: true,
    },
    hostedLoginBox: true,
  });
