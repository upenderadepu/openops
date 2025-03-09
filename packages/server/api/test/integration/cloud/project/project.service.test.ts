import { ApplicationError, openOpsId, Project } from '@openops/shared';
import { databaseConnection } from '../../../../src/app/database/database-connection';
import { projectService } from '../../../../src/app/project/project-service';
import {
  createMockOrganizationWithOwner,
  createMockProject,
  createMockUser,
} from '../../../helpers/mocks';

beforeAll(async () => {
  await databaseConnection().initialize();
});

afterAll(async () => {
  await databaseConnection().destroy();
});

describe('Project Service', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const { mockOrganization, mockOwner } = createMockOrganizationWithOwner({
        organization: {
          id: openOpsId(),
          name: 'Test Org',
        },
      });
      await databaseConnection().getRepository('user').save(mockOwner);
      await databaseConnection()
        .getRepository('organization')
        .save(mockOrganization);

      const mockProject = createMockProject({
        ownerId: mockOwner.id,
        organizationId: mockOrganization.id,
      });

      const result = await projectService.create({
        ...mockProject,
        tablesDatabaseId: 123,
      });
      const savedProject = await projectService.getOneOrThrow(result.id);

      expect(savedProject.id).toBe(result.id);
      expect(savedProject.tablesDatabaseId).toBe(123);

      expect(savedProject.ownerId).toBe(mockOwner.id);
      expect(savedProject.organizationId).toBe(mockOrganization.id);
    });
  });

  describe('update', () => {
    it('should update the project displayName', async () => {
      const mockProject = await createProjectInDB();

      let savedProject = await projectService.getOneOrThrow(mockProject.id);
      expect(savedProject.displayName).toBe(mockProject.displayName);

      await projectService.update(mockProject.id, {
        displayName: 'Test Org 2',
      });

      savedProject = await projectService.getOneOrThrow(mockProject.id);

      expect(savedProject.displayName).toBe('Test Org 2');
    });

    it('should update the project tablesDatabaseId', async () => {
      const mockProject = await createProjectInDB();

      let savedProject = await projectService.getOneOrThrow(mockProject.id);
      expect(savedProject.tablesDatabaseId).toBe(mockProject.tablesDatabaseId);

      await projectService.update(mockProject.id, {
        tablesDatabaseId: 4564,
      });

      savedProject = await projectService.getOneOrThrow(mockProject.id);
      expect(savedProject.tablesDatabaseId).toBe(4564);
    });

    it('should update the project ownerId', async () => {
      const user = createMockUser();
      await databaseConnection().getRepository('user').save(user);
      const mockProject = await createProjectInDB();

      let savedProject = await projectService.getOneOrThrow(mockProject.id);
      expect(savedProject.ownerId).toBe(mockProject.ownerId);

      await projectService.update(mockProject.id, {
        ownerId: user.id,
      });

      savedProject = await projectService.getOneOrThrow(mockProject.id);
      expect(savedProject.ownerId).toBe(user.id);
    });

    it('should throw an error if the project does not exist', async () => {
      await expect(
        projectService.update('orgId', { displayName: 'New Name' }),
      ).rejects.toThrow(ApplicationError);
    });
  });
});

async function createProjectInDB(): Promise<Project> {
  const { mockOrganization, mockOwner } = createMockOrganizationWithOwner({
    organization: {
      id: openOpsId(),
      name: 'Test Org',
    },
  });
  await databaseConnection().getRepository('user').save(mockOwner);
  await databaseConnection()
    .getRepository('organization')
    .save(mockOrganization);

  const mockProject = createMockProject({
    ownerId: mockOwner.id,
    organizationId: mockOrganization.id,
  });

  await databaseConnection().getRepository('project').save(mockProject);

  return mockProject;
}
