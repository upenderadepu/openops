import {
  openOpsId,
  UserSettings,
  UserSettingsDefinition,
} from '@openops/shared';
import { repoFactory } from '../core/db/repo-factory';
import { UserSettingsEntity } from './user-settings-entity';

export const userSettingsRepo = repoFactory(UserSettingsEntity);

export const userSettingsService = {
  async get({
    userId,
    projectId,
    organizationId,
  }: {
    userId: string;
    projectId: string;
    organizationId: string;
  }): Promise<UserSettings | null> {
    return userSettingsRepo().findOneBy({
      userId,
      projectId,
      organizationId,
    });
  },
  async upsert({
    userId,
    projectId,
    organizationId,
    settings,
  }: {
    userId: string;
    projectId: string;
    organizationId: string;
    settings: UserSettingsDefinition;
  }): Promise<UserSettings> {
    const userSettings = await this.get({
      userId,
      projectId,
      organizationId,
    });

    if (userSettings) {
      const newUserSettings = {
        ...userSettings,
        settings,
      };
      await userSettingsRepo().update(userSettings.id, newUserSettings);
      return newUserSettings;
    }

    return userSettingsRepo().save({
      id: openOpsId(),
      userId,
      projectId,
      organizationId,
      settings,
    });
  },
};
