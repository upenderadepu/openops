import { cn } from '@openops/components/ui';
import { Plus } from 'lucide-react';
import React from 'react';

type FlowAddButtonProps = {
  showDropIndicator: boolean;
  isStepInsideDropzone: boolean;
  actionMenuOpen: boolean;
  className?: string;
  iconClassName?: string;
};

const FlowAddButton = React.forwardRef<HTMLDivElement, FlowAddButtonProps>(
  (
    {
      isStepInsideDropzone,
      actionMenuOpen,
      showDropIndicator,
      className,
      iconClassName,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'size-8 flex items-center justify-center cursor-pointer rounded-full border border-greyBlue bg-background text-greyBlue',
          {
            'bg-blueAccent-200 text-white': showDropIndicator || actionMenuOpen,
            'shadow-add-button': isStepInsideDropzone,
            'hover:bg-greyBlue-50 dark:hover:bg-greyBlue-50':
              !isStepInsideDropzone && !actionMenuOpen,
            'transition-all':
              isStepInsideDropzone || actionMenuOpen || showDropIndicator,
          },
          className,
        )}
      >
        <Plus
          className={cn('size-5 rounded-full stroke-[2.5]', iconClassName)}
          style={{
            position: 'relative',
          }}
          data-testid="addBlockPlusIcon"
        />
      </div>
    );
  },
);

FlowAddButton.displayName = 'FlowAddButton';
export { FlowAddButton };
