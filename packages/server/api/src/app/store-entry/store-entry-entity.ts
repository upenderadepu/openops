import { STORE_KEY_MAX_LENGTH, StoreEntry } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import {
  BaseColumnSchemaPart,
  JSONB_COLUMN_TYPE,
  OpenOpsIdSchema,
} from '../database/database-common';

type StoreEntrySchema = StoreEntry;

export const StoreEntryEntity = new EntitySchema<StoreEntrySchema>({
  name: 'store-entry',
  columns: {
    ...BaseColumnSchemaPart,
    key: {
      type: String,
      length: STORE_KEY_MAX_LENGTH,
    },
    projectId: OpenOpsIdSchema,
    value: {
      type: JSONB_COLUMN_TYPE,
      nullable: true,
    },
  },
  uniques: [
    {
      columns: ['projectId', 'key'],
    },
  ],
});
