import { WebhookSimulation } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import {
  BaseColumnSchemaPart,
  OpenOpsIdSchema,
} from '../../database/database-common';

export type WebhookSimulationSchema = WebhookSimulation;

export const WebhookSimulationEntity =
  new EntitySchema<WebhookSimulationSchema>({
    name: 'webhook_simulation',
    columns: {
      ...BaseColumnSchemaPart,
      flowId: OpenOpsIdSchema,
      projectId: OpenOpsIdSchema,
    },
    indices: [
      {
        name: 'idx_webhook_simulation_flow_id',
        columns: ['flowId'],
        unique: true,
      },
    ],
  });
