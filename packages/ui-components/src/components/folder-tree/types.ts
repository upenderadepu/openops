export type FolderItem = {
  id: string;
  displayName: string;
  type: 'folder' | 'item';
  itemCount?: number;
  children?: FolderItem[];
  parentFolderId?: string;
};

export type OnItemClick = (item: FolderItem) => void;
