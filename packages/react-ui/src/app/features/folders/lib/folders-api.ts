import { api } from '@/app/lib/api';
import {
  CreateFolderRequest,
  Folder,
  FolderDto,
  ListFolderFlowsRequest,
  UpdateFolderRequest,
} from '@openops/shared';

export const foldersApi = {
  get(folderId: string) {
    return api.get<Folder>(`/v1/folders/${folderId}`);
  },
  listFlows(req: ListFolderFlowsRequest): Promise<FolderDto[]> {
    return api.get<FolderDto[]>('/v1/folders/flows', req);
  },
  create(req: CreateFolderRequest) {
    return api.post<FolderDto>('/v1/folders', req);
  },
  delete(folderId: string) {
    return api.delete<void>(`/v1/folders/${folderId}`);
  },
  updateFolder(folderId: string, req: UpdateFolderRequest) {
    return api.post<Folder>(`/v1/folders/${folderId}`, req);
  },
};
