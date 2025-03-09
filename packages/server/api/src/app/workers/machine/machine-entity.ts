import { WorkerMachine } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import {
  BaseColumnSchemaPart,
  JSONB_COLUMN_TYPE,
} from '../../database/database-common';

type WorkerMachineSchema = WorkerMachine;

export const WorkerMachineEntity = new EntitySchema<WorkerMachineSchema>({
  name: 'worker_machine',
  columns: {
    ...BaseColumnSchemaPart,
    type: {
      type: String,
    },
    information: {
      type: JSONB_COLUMN_TYPE,
    },
  },
  relations: {},
});
