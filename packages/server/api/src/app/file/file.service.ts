import { fileCompressor, logger } from '@openops/server-shared';
import {
  ApplicationError,
  ErrorCode,
  File,
  FileCompression,
  FileId,
  FileType,
  isNil,
  openOpsId,
  ProjectId,
} from '@openops/shared';
import { repoFactory } from '../core/db/repo-factory';
import { FileEntity } from './file.entity';

type SaveParams = {
  fileId?: FileId | undefined;
  projectId?: ProjectId;
  data: Buffer;
  type: FileType;
  organizationId?: string;
  compression: FileCompression;
};

type GetOneParams = {
  fileId: FileId;
  projectId?: ProjectId;
};

type DeleteOneParams = {
  fileId: FileId;
  projectId: ProjectId;
};

export const fileRepo = repoFactory<File>(FileEntity);

export const fileService = {
  async save({
    fileId,
    projectId,
    organizationId,
    data,
    type,
    compression,
  }: SaveParams): Promise<File> {
    const file = {
      id: fileId ?? openOpsId(),
      projectId,
      organizationId,
      data,
      type,
      compression,
    };

    const savedFile = await fileRepo().save(file);

    logger.info(
      `[FileService#save] fileId=${savedFile.id} data.length=${data.length}`,
    );

    return savedFile;
  },

  async getOne({ projectId, fileId }: GetOneParams): Promise<File | null> {
    const file = await fileRepo().findOneBy({
      projectId,
      id: fileId,
    });

    if (isNil(file)) {
      return null;
    }

    const decompressedData = await fileCompressor.decompress({
      data: file.data,
      compression: file.compression,
    });

    file.data = decompressedData;
    return file;
  },

  async getOneOrThrow(params: GetOneParams): Promise<File> {
    const file = await this.getOne(params);

    if (isNil(file)) {
      throw new ApplicationError({
        code: ErrorCode.FILE_NOT_FOUND,
        params: {
          id: params.fileId,
        },
      });
    }

    return file;
  },

  async delete({ fileId, projectId }: DeleteOneParams): Promise<void> {
    logger.info('Deleted file with Id ' + fileId);
    await fileRepo().delete({ id: fileId, projectId });
  },
};
