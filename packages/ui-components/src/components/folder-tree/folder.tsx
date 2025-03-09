import { UNCATEGORIZED_FOLDER_ID } from '@openops/shared';
import { ChevronRight, Folder, Workflow } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import { OverflowTooltip } from '../overflow-tooltip';
import { FolderItem, OnItemClick } from './types';

type FolderComponentProps = {
  item: FolderItem;
  level: number;
  selectedItemId?: string;
  folderAddons?: (
    item: FolderItem,
    setAddonsOpen: React.Dispatch<boolean>,
  ) => React.ReactNode;
  fileAddons?: (item: FolderItem) => React.ReactNode;
  onItemClick: OnItemClick;
  onFolderClick: OnItemClick;
  expandedFolders: Set<string>;
  toggleFolder: (
    folderItem: FolderItem,
    collapseNonAncestralFolders?: boolean,
  ) => void;
  collapseDisabled: boolean;
};

const FolderComponent = ({
  item,
  level,
  selectedItemId,
  fileAddons,
  folderAddons,
  onItemClick,
  onFolderClick,
  expandedFolders,
  toggleFolder,
  collapseDisabled,
}: FolderComponentProps) => {
  const [addonsOpen, setAddonsOpen] = useState(false);
  const isOpen = expandedFolders.has(item.id);

  if (item.type === 'item') {
    return (
      <div
        role="button"
        data-testid="folder-item"
        onClick={() => onItemClick(item)}
        className={cn(
          'flex items-center max-w-full py-1 px-2 hover:bg-muted rounded-xs group',
          {
            'ml-[38px]': level > 0,
          },
          {
            'bg-blueAccent-100 dark:bg-blueAccent-100/10':
              selectedItemId === item.id,
          },
        )}
      >
        <Workflow className="size-4 flex-shrink-0 mr-2 text-primary/90" />
        <OverflowTooltip text={item.displayName} className="font-normal" />
        <div className={cn('hidden ml-auto flex-shrink-0 group-hover:flex')}>
          {typeof fileAddons === 'function' && fileAddons(item)}
        </div>
      </div>
    );
  }

  const sortedChildren = item.children
    ? [...item.children].sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.displayName.localeCompare(b.displayName);
      })
    : [];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => {
        if (sortedChildren.length > 0) {
          toggleFolder(item);
        }
      }}
    >
      <CollapsibleTrigger
        className={cn(
          'flex items-center py-1 pr-1 w-full text-left overflow-hidden max-w-full hover:bg-muted rounded-xs group',
          level > 0 && 'pl-[18px]',
        )}
        data-testid="collapsible-folder-trigger"
      >
        {sortedChildren.length > 0 && !collapseDisabled ? (
          <ChevronRight
            className={cn('size-4 flex-shrink-0 mr-3 transition-transform', {
              'transform rotate-90': isOpen,
            })}
          />
        ) : (
          <div className="size-4 flex-shrink-0 mr-3" />
        )}

        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFolder(item, true);
            onFolderClick(item);
          }}
          className="flex items-center max-w-full min-w-0 w-full"
        >
          <Folder className="size-4 flex-shrink-0 mr-2" />
          <div className="flex items-center flex-1 min-w-0">
            <OverflowTooltip text={item.displayName} className="font-normal" />
            {typeof item.itemCount === 'number' ? (
              <span
                className={cn(
                  'text-xs text-gray-500 dark:text-gray-100 ml-2 flex-shrink-0 whitespace-nowrap',
                  {
                    'group-hover:invisible':
                      item.id !== UNCATEGORIZED_FOLDER_ID,
                  },
                )}
              >
                ({item.itemCount})
              </span>
            ) : null}
            <div
              className={cn(
                'invisible ml-auto flex-shrink-0 group-hover:visible',
                {
                  flex: addonsOpen,
                },
              )}
            >
              {typeof folderAddons === 'function' &&
                folderAddons(item, setAddonsOpen)}
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn('data-[state=open]:animate-slideDown overflow-hidden', {
          'data-[state=closed]:animate-slideUp':
            !isOpen && sortedChildren.length > 0,
        })}
      >
        <div
          className={cn('border-l border-gray-200 ml-2', {
            'ml-[26px]': level > 0,
          })}
        >
          {sortedChildren.map((child) => (
            <FolderComponent
              key={child.id}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
              onFolderClick={onFolderClick}
              selectedItemId={selectedItemId}
              folderAddons={folderAddons}
              fileAddons={fileAddons}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              collapseDisabled={collapseDisabled}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

FolderComponent.displayName = 'FolderComponent';
export { FolderComponent };
