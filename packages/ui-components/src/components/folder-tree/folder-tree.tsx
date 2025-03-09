import { cn } from '../../lib/cn';
import { FolderComponent } from './folder';
import { FolderItem, OnItemClick } from './types';
import { getPathToRoot } from './utils';

export type CollapsibleFolderTreeProps = {
  folderItems: FolderItem[];
  selectedItemId?: string;
  className?: string;
  folderAddons?: (
    item: FolderItem,
    setAddonsOpen: React.Dispatch<boolean>,
  ) => React.ReactNode;
  fileAddons?: (item: FolderItem) => React.ReactNode;
  onItemClick: OnItemClick;
  onFolderClick: OnItemClick;
  expandedFolders: Set<string>;
  setExpandedFolders: (ids: Set<string>) => void;
  collapseDisabled?: boolean;
};

const FolderTree = ({
  folderItems,
  className,
  selectedItemId,
  folderAddons,
  fileAddons,
  onItemClick,
  onFolderClick,
  expandedFolders,
  setExpandedFolders,
  collapseDisabled = false,
}: CollapsibleFolderTreeProps) => {
  const toggleFolder = (
    folderItem: FolderItem,
    collapseNonAncestralFolders = false,
  ) => {
    const { id: folderId } = folderItem;

    const getNewExpandedFoldersState = () => {
      if (collapseNonAncestralFolders) {
        const pathToRootSet = new Set(getPathToRoot(folderId, folderItems));

        const newSet = new Set(expandedFolders);
        if (newSet.has(folderId)) {
          pathToRootSet.delete(folderId);
        }
        return pathToRootSet;
      }
      const newSet = new Set(expandedFolders);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    };

    setExpandedFolders(getNewExpandedFoldersState());
  };

  return (
    <div
      className={cn(
        'px-4 py-3 bg-background text-primary/90 dark:text-primary',
        className,
      )}
      role="tree"
    >
      {folderItems.map((item) => (
        <FolderComponent
          key={item.id}
          item={item}
          level={0}
          selectedItemId={selectedItemId}
          onItemClick={onItemClick}
          onFolderClick={onFolderClick}
          folderAddons={folderAddons}
          fileAddons={fileAddons}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          collapseDisabled={collapseDisabled}
        />
      ))}
    </div>
  );
};

FolderTree.displayName = 'FolderTree';
export { FolderTree };
