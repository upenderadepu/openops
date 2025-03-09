import { Static, Type } from '@sinclair/typebox';

export const UserSettingsDefinition = Type.Record(Type.String(), Type.Any());
export type UserSettingsDefinition = Static<typeof UserSettingsDefinition>;

export const UserSettings = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  projectId: Type.String(),
  organizationId: Type.String(),
  settings: UserSettingsDefinition,
});

export type UserSettings = Static<typeof UserSettings>;
