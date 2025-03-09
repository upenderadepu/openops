import { api } from '@/app/lib/api';
import { UserSettingsDefinition } from '@openops/shared';

export const userSettingsApi = {
  getUserSettings(): Promise<UserSettingsDefinition> {
    return api.get<UserSettingsDefinition>(`/v1/users/me/settings`);
  },
  setUserSettings(
    request: UserSettingsDefinition,
  ): Promise<UserSettingsDefinition> {
    return api.put<UserSettingsDefinition>(`/v1/users/me/settings`, request);
  },
};
