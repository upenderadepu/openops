import { authenticateDefaultUserInOpenOpsTables } from '@openops/common';
import { AppSystemProp, system } from '@openops/server-shared';
import {
  ApplicationError,
  ErrorCode,
  isNil,
  PrincipalType,
  Project,
  ProjectMemberRole,
  User,
} from '@openops/shared';
import { openopsTables } from '../../../openops-tables';
import { organizationService } from '../../../organization/organization.service';
import { projectService } from '../../../project/project-service';
import { userService } from '../../../user/user-service';
import { accessTokenManager } from '../../lib/access-token-manager';
import { AuthenticationServiceHooks } from './authentication-service-hooks';

const DEFAULT_ORGANIZATION_NAME = 'organization';

export const communityAuthenticationServiceHooks: AuthenticationServiceHooks = {
  async preSignIn() {
    // Empty
  },
  async preSignUp() {
    // Empty
  },
  async postSignUp({ user, tablesAccessToken, tablesRefreshToken }) {
    const adminEmail = system.getOrThrow(AppSystemProp.OPENOPS_ADMIN_EMAIL);

    let organization = await organizationService.getOldestOrganization();

    const isAdminUser = user.email === adminEmail;
    if (isAdminUser) {
      if (organization) {
        throw Error(
          'There is already an organization. You cannot create an admin user if an organization already exists.',
        );
      } else {
        await createOrganizationAndProject(user, tablesAccessToken);
      }

      return getProjectAndToken(user, tablesRefreshToken);
    }

    const adminUser = await userService.getUserByEmailOrFail({
      email: adminEmail,
    });

    organization = !isNil(adminUser.organizationId)
      ? await organizationService.getOne(adminUser.organizationId)
      : organization;

    if (!organization) {
      throw new ApplicationError({
        code: ErrorCode.ENTITY_NOT_FOUND,
        params: {
          message: 'Admin organization not found',
        },
      });
    }

    await userService.addUserToOrganization({
      id: user.id,
      organizationId: organization.id,
    });

    await addUserToDefaultWorkspace({
      email: user.email,
      workspaceId: organization.tablesWorkspaceId,
    });

    return getProjectAndToken(user, tablesRefreshToken);
  },

  async postSignIn({ user, tablesRefreshToken }) {
    return getProjectAndToken(user, tablesRefreshToken);
  },
};

async function getProjectAndToken(
  user: User,
  tablesRefreshToken: string,
): Promise<{
  user: User;
  project: Project;
  token: string;
  tablesRefreshToken: string;
  projectRole: ProjectMemberRole;
}> {
  const updatedUser = await userService.getOneOrFail({ id: user.id });

  const project = await projectService.getOneForUser(updatedUser);
  if (isNil(project)) {
    throw new ApplicationError({
      code: ErrorCode.INVITATION_ONLY_SIGN_UP,
      params: {
        message: 'No project found for user',
      },
    });
  }

  const organization = await organizationService.getOneOrThrow(
    project.organizationId,
  );

  const token = await accessTokenManager.generateToken({
    id: user.id,
    type: PrincipalType.USER,
    projectId: project.id,
    organization: {
      id: organization.id,
    },
  });

  return {
    user: updatedUser,
    token,
    project,
    tablesRefreshToken,
    projectRole: ProjectMemberRole.ADMIN,
  };
}

async function createOrganizationAndProject(
  user: User,
  tablesToken: string,
): Promise<void> {
  const { workspaceId, databaseId } =
    await openopsTables.createDefaultWorkspaceAndDatabase(tablesToken);

  const organization = await organizationService.create({
    ownerId: user.id,
    name: DEFAULT_ORGANIZATION_NAME,
    tablesWorkspaceId: workspaceId,
  });

  await projectService.create({
    displayName: `${user.firstName}'s Project`,
    ownerId: user.id,
    organizationId: organization.id,
    tablesDatabaseId: databaseId,
  });
}

async function addUserToDefaultWorkspace(values: {
  email: string;
  workspaceId: number;
}): Promise<void> {
  const { token: defaultToken } =
    await authenticateDefaultUserInOpenOpsTables();

  await openopsTables.addUserToWorkspace(defaultToken, {
    ...values,
  });
}
