import { Static, Type } from '@sinclair/typebox';
import { BaseModelSchema, Nullable, NullableEnum } from '../common';
import { ProjectMemberRole } from '../project';
import { OrganizationRole } from '../user/index';

export enum InvitationType {
  PLATFORM = 'PLATFORM',
  PROJECT = 'PROJECT',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export const UserInvitation = Type.Object({
  ...BaseModelSchema,
  email: Type.String(),
  status: Type.Enum(InvitationStatus),
  type: Type.Enum(InvitationType),
  organizationId: Type.String(),
  organizationRole: NullableEnum(Type.Enum(OrganizationRole)),
  projectId: Nullable(Type.String()),
  projectRole: NullableEnum(Type.Enum(ProjectMemberRole)),
});

export type UserInvitation = Static<typeof UserInvitation>;

export const UserInvitationWithLink = Type.Composite([
  UserInvitation,
  Type.Object({
    link: Type.Optional(Type.String()),
  }),
]);

export type UserInvitationWithLink = Static<typeof UserInvitationWithLink>;

export const SendUserInvitationRequest = Type.Object({
  email: Type.String(),
  type: Type.Enum(InvitationType),
  organizationRole: Type.Optional(Type.Enum(OrganizationRole)),
  projectId: Nullable(Type.String()),
  projectRole: Type.Optional(Type.Enum(ProjectMemberRole)),
  expireyInSeconds: Type.Optional(Type.Number()),
});

export type SendUserInvitationRequest = Static<
  typeof SendUserInvitationRequest
>;

export const AcceptUserInvitationRequest = Type.Object({
  invitationToken: Type.String(),
});

export type AcceptUserInvitationRequest = Static<
  typeof AcceptUserInvitationRequest
>;

export const ListUserInvitationsRequest = Type.Object({
  limit: Type.Optional(Type.Number()),
  cursor: Type.Optional(Type.String()),
  type: Type.Enum(InvitationType),
  projectId: Nullable(Type.String()),
  status: Type.Optional(Type.Enum(InvitationStatus)),
});

export type ListUserInvitationsRequest = Static<
  typeof ListUserInvitationsRequest
>;
