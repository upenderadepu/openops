import { BaseModel } from '../common/base-model';
import { OpenOpsId } from '../common/id-generator';
import { FlowId } from '../flows/flow';
import { ProjectId } from '../project/project';

export type WebhookSimulationId = OpenOpsId;

export type WebhookSimulation = BaseModel<WebhookSimulationId> & {
  flowId: FlowId;
  projectId: ProjectId;
};
