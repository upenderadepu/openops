import { BlockAuth, Property, Validators } from '@openops/blocks-framework';
import { AnodotTokens, authenticateUserWithAnodot } from './common/auth';
import { getAnodotUsers } from './common/users';

export const anadotAuth = BlockAuth.CustomAuth({
  description: 'The authentication to use to connect to Anodot',
  required: true,
  props: {
    authUrl: Property.ShortText({
      displayName: 'Authentication URL',
      description: 'The URL to use to authenticate with Anodot',
      required: true,
      validators: [Validators.url],
      defaultValue: 'https://tokenizer.mypileus.io/prod',
    }),
    apiUrl: Property.ShortText({
      displayName: 'API URL',
      description: 'The URL to use to request Anodot API',
      required: true,
      validators: [Validators.url],
      defaultValue: 'https://api.mypileus.io/api',
    }),
    username: Property.ShortText({
      required: true,
      displayName: 'Username',
      description: 'The username to use to connect to Anodot',
    }),
    password: BlockAuth.SecretText({
      required: true,
      displayName: 'Password',
      description: 'The password to use to connect to Anodot',
    }),
  },
  validate: async ({ auth }) => {
    let anodotTokens: AnodotTokens;
    try {
      anodotTokens = await authenticateUserWithAnodot(
        auth.authUrl,
        auth.username,
        auth.password,
      );
    } catch (e) {
      return {
        valid: false,
        error: 'Error validating authentication.',
      };
    }

    try {
      await getAnodotUsers(auth.apiUrl, anodotTokens);
    } catch (e) {
      return {
        valid: false,
        error: 'Error validating API access.',
      };
    }

    return {
      valid: true,
    };
  },
});
