import { File, FileCompression, FileType, Project } from '@openops/shared';
import { EntitySchema } from 'typeorm';
import {
  BaseColumnSchemaPart,
  BLOB_COLUMN_TYPE,
  OpenOpsIdSchema,
} from '../database/database-common';

type FileSchema = File & {
  project: Project;
};

export const FileEntity = new EntitySchema<FileSchema>({
  name: 'file',
  columns: {
    ...BaseColumnSchemaPart,
    projectId: { ...OpenOpsIdSchema, nullable: true },
    organizationId: { ...OpenOpsIdSchema, nullable: true },
    data: {
      type: BLOB_COLUMN_TYPE,
      nullable: false,
    },
    type: {
      type: String,
      default: FileType.UNKNOWN,
      nullable: false,
    },
    compression: {
      type: String,
      default: FileCompression.NONE,
      nullable: false,
    },
  },
  indices: [
    {
      name: 'idx_file_project_id',
      columns: ['projectId'],
    },
    {
      name: 'idx_file_type_created_desc',
      columns: ['type', 'created'],
    },
  ],
  relations: {
    project: {
      type: 'many-to-one',
      target: 'project',
      cascade: true,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'projectId',
        foreignKeyConstraintName: 'fk_file_project_id',
      },
    },
  },
});
