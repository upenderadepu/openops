import { t } from 'i18next';
import { PlusCircleIcon } from 'lucide-react';
import { TooltipWrapper } from '../tooltip-wrapper';
import { FolderItem } from './types';

type Props = {
  item: FolderItem;
  moreActions: React.ReactNode;
  onAddItemClick?: (item: FolderItem) => void;
};

const FolderAddons = ({ item, moreActions, onAddItemClick }: Props) => (
  <div className="flex items-center gap-2">
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {moreActions}
    </div>
    {onAddItemClick && (
      <TooltipWrapper tooltipText={t('Create Workflow')} tooltipPlacement="top">
        <PlusCircleIcon
          role="button"
          data-testid="add-flow"
          className="h-4 w-4 text-blue-500 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAddItemClick(item);
          }}
        />
      </TooltipWrapper>
    )}
  </div>
);

FolderAddons.displayName = 'FolderAddons';

export { FolderAddons };
