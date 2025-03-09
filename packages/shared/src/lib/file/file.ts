import { Static, Type } from '@sinclair/typebox';
import { BaseModelSchema } from '../common/base-model';
import { OpenOpsId } from '../common/id-generator';
import { FileCompression } from './file-compression';
import { FileType } from './file-type';

export type FileId = OpenOpsId;

export const File = Type.Object({
  ...BaseModelSchema,
  projectId: Type.Optional(Type.String()),
  organizationId: Type.Optional(Type.String()),
  type: Type.Enum(FileType),
  compression: Type.Enum(FileCompression),
  data: Type.Unknown(),
});
export type File = Static<typeof File> & {
  data: Buffer;
};
