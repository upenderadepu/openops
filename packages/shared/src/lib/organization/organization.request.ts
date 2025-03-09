import { Static, Type } from '@sinclair/typebox';

export const UpdateOrganizationRequestBody = Type.Object({
  name: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  tablesWorkspaceId: Type.Optional(Type.Number()),
});

export type UpdateOrganizationRequestBody = Static<
  typeof UpdateOrganizationRequestBody
>;
