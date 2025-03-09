import { UserSettings } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import {
  BaseColumnSchemaPart,
  JSONB_COLUMN_TYPE,
} from '../database/database-common';

export type UserSettingsSchema = UserSettings;

export const UserSettingsEntity = new EntitySchema<UserSettingsSchema>({
  name: 'user_settings',
  columns: {
    ...BaseColumnSchemaPart,
    userId: {
      type: String,
    },
    projectId: {
      type: String,
    },
    organizationId: {
      type: String,
    },
    settings: {
      type: JSONB_COLUMN_TYPE,
    },
  },
  indices: [
    {
      name: 'idx_user_settings_composite',
      columns: ['userId', 'projectId', 'organizationId'],
      unique: true,
    },
  ],
  relations: {
    userId: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: { name: 'userId' },
      onDelete: 'CASCADE',
    },
    projectId: {
      type: 'many-to-one',
      target: 'project',
      joinColumn: { name: 'projectId' },
      onDelete: 'CASCADE',
    },
    organizationId: {
      type: 'many-to-one',
      target: 'organization',
      joinColumn: { name: 'organizationId' },
      onDelete: 'CASCADE',
    },
  },
});
