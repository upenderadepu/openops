import {
  DropdownProperty,
  OAuth2PropertyValue,
  Property,
} from '@openops/blocks-framework';
import { getUserRepo } from './github-api';

export function getRepositoryProperty(): DropdownProperty<
  { repo: string; owner: string },
  true
> {
  return Property.Dropdown<{ repo: string; owner: string }, true>({
    displayName: 'Repository',
    refreshers: ['auth'],
    required: true,
    options: async ({ auth }) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please authenticate first',
        };
      }
      const authProp: OAuth2PropertyValue = auth as OAuth2PropertyValue;
      const repositories = await getUserRepo(authProp);
      return {
        disabled: false,
        options: repositories.map((repo) => {
          return {
            label: repo.owner.login + '/' + repo.name,
            value: {
              owner: repo.owner.login,
              repo: repo.name,
            },
          };
        }),
      };
    },
  });
}
