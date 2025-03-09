import { Project, User } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import { BaseColumnSchemaPart } from '../database/database-common';

export type UserSchema = User & {
  projects: Project[];
};

export const UserEntity = new EntitySchema<UserSchema>({
  name: 'user',
  columns: {
    ...BaseColumnSchemaPart,
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    trackEvents: {
      type: Boolean,
      nullable: true,
    },
    newsLetter: {
      type: Boolean,
      nullable: true,
    },
    organizationRole: {
      type: String,
      nullable: false,
    },
    externalId: {
      type: String,
      nullable: true,
    },
    organizationId: {
      type: String,
      nullable: true,
    },
  },
  indices: [
    {
      name: 'idx_user_organization_id_email',
      columns: ['email'],
      unique: true,
    },
  ],
  relations: {
    projects: {
      type: 'one-to-many',
      target: 'user',
      inverseSide: 'owner',
    },
  },
});
