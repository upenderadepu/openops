export const mockedRepo = {
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(),
  save: jest.fn(),
};

jest.mock('../../../src/app/core/db/repo-factory', () => {
  return {
    repoFactory: () => jest.fn().mockReturnValue(mockedRepo),
  };
});

const getUsedBlocksMock = jest.fn();
export const mockedShared = {
  ...jest.requireActual('@openops/shared'),
  flowHelper: { getUsedBlocks: getUsedBlocksMock, apply: jest.fn((x) => x) },
};

jest.mock('@openops/shared', () => mockedShared);

const flowServiceMock = {
  getOnePopulatedOrThrow: jest.fn(),
};
jest.mock('../../../src/app/flows/flow/flow.service', () => {
  return {
    flowService: flowServiceMock,
  };
});
import { TemplateType } from '@openops/shared';
import { flowTemplateService } from '../../../src/app/flow-template/flow-template.service';

const someFlowTemplate = { id: 'some-id', name: 'some-name' };

describe('flowTemplateService', () => {
  describe('getFlowTemplate', () => {
    it('should return a flow template given an id', async () => {
      mockedRepo.findOneBy.mockResolvedValue(someFlowTemplate);

      const flowTemlpate = await flowTemplateService.getFlowTemplate('some-id');

      expect(flowTemlpate).not.toBeNull();
      expect(flowTemlpate!.name).toBe(someFlowTemplate.name);
    });
  });

  describe('getFlowTemplates', () => {
    it('should return a list of flow templates', async () => {
      const queryBuilder = {
        select: jest.fn(),
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn(),
      };

      queryBuilder.select.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockResolvedValue([someFlowTemplate]);

      mockedRepo.createQueryBuilder.mockReturnValue(queryBuilder);

      const flowTemplates = await flowTemplateService.getFlowTemplates({
        search: 'some-search',
        projectId: 'some-project-id',
        organizationId: 'some-organization-id',
      });

      expect(flowTemplates).not.toBeNull();
      expect(flowTemplates!.length).toBe(1);
    });
  });

  describe('createFlowTemplate', () => {
    it('should create and return a new flow template', async () => {
      const requestOptions = {
        flowId: 'some-flow-id',
        tags: ['tag1', 'tag2'],
        services: ['service1'],
        domains: ['domain1'],
        blocks: ['block1'],
        organizationId: 'organization-id',
        projectId: 'project-id',
      };

      const flowVersion = {
        id: 'some-flow-id',
        displayName: 'Test Flow',
        description: 'Test Flow Description',
        trigger: { type: 'trigger-type' },
      };
      flowServiceMock.getOnePopulatedOrThrow.mockResolvedValue({
        version: flowVersion,
      });
      getUsedBlocksMock.mockReturnValue(['step1', 'step2']);
      const insertResult = { id: 'some-flow-id' };
      mockedRepo.save = jest.fn().mockResolvedValue(insertResult);

      const result = await flowTemplateService.createFlowTemplate(
        requestOptions,
      );

      expect(flowServiceMock.getOnePopulatedOrThrow).toHaveBeenCalledWith({
        id: requestOptions.flowId,
        projectId: requestOptions.projectId,
      });
      expect(mockedRepo.save).toHaveBeenCalledWith({
        id: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        name: flowVersion.displayName,
        description: flowVersion.description,
        type: TemplateType.ORGANIZATION,
        tags: requestOptions.tags,
        services: requestOptions.services,
        domains: requestOptions.domains,
        blocks: ['step1', 'step2'],
        template: flowVersion.trigger,
        projectId: requestOptions.projectId,
        organizationId: requestOptions.organizationId,
      });
      expect(result).toEqual(insertResult);
    });

    it('should throw an error if flowVersionService throws', async () => {
      const requestOptions = {
        flowId: 'some-flow-id',
        tags: ['tag1', 'tag2'],
        services: ['service1'],
        domains: ['domain1'],
        blocks: ['block1'],
        organizationId: 'organization-id',
        projectId: 'project-id',
      };

      flowServiceMock.getOnePopulatedOrThrow.mockRejectedValue(
        new Error('Flow version not found'),
      );

      await expect(
        flowTemplateService.createFlowTemplate(requestOptions),
      ).rejects.toThrow('Flow version not found');
    });
  });
});
