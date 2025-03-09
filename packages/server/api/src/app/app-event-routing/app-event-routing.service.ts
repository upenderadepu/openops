import { logger } from '@openops/server-shared';
import { FlowId, openOpsId, ProjectId } from '@openops/shared';
import { repoFactory } from '../core/db/repo-factory';
import {
  AppEventRouting,
  AppEventRoutingEntity,
} from './app-event-routing.entity';

const appEventRoutingRepo = repoFactory(AppEventRoutingEntity);

export const appEventRoutingService = {
  async listListeners({
    appName,
    event,
    identifierValue,
  }: ListParams): Promise<AppEventRouting[]> {
    return appEventRoutingRepo().findBy({ appName, event, identifierValue });
  },
  async createListeners({
    appName,
    events,
    identifierValue,
    flowId,
    projectId,
  }: CreateParams): Promise<void> {
    logger.info(
      {
        appName,
        events,
        identifierValue,
        flowId,
        projectId,
      },
      '[AppEventRoutingService#createListeners] create',
    );
    const upsertCommands: Promise<unknown>[] = [];
    events.forEach((event) => {
      const upsert = appEventRoutingRepo().upsert(
        {
          id: openOpsId(),
          appName,
          event,
          identifierValue,
          flowId,
          projectId,
        },
        ['appName', 'event', 'identifierValue', 'projectId', 'flowId'],
      );
      upsertCommands.push(upsert);
    });
    await Promise.all(upsertCommands);
  },
  async deleteListeners({ projectId, flowId }: DeleteParams): Promise<void> {
    await appEventRoutingRepo().delete({
      projectId,
      flowId,
    });
  },
};

type ListParams = {
  appName: string;
  event: string;
  identifierValue: string;
};
type DeleteParams = {
  projectId: ProjectId;
  flowId: FlowId;
};

type CreateParams = {
  appName: string;
  events: string[];
  identifierValue: string;
  flowId: FlowId;
  projectId: ProjectId;
};
