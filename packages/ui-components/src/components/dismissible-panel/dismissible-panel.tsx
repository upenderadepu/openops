import { X } from 'lucide-react';

import React from 'react';
import { cn } from '../../lib/cn';
import { TooltipWrapper } from '../tooltip-wrapper';

type DismissiblePanelProps = {
  closeTooltip: string;
  onClose: () => void;
  className?: string;
  buttonClassName?: string;
  children: React.ReactNode;
};

const DismissiblePanel = ({
  closeTooltip,
  onClose,
  className,
  buttonClassName,
  children,
}: DismissiblePanelProps) => {
  return (
    <div
      className={cn(
        'w-full h-full relative border rounded-2xl overflow-hidden',
        className,
      )}
    >
      <TooltipWrapper tooltipText={closeTooltip}>
        <X
          role="button"
          size={14}
          className={cn(
            'absolute top-3 right-3 text-muted-foreground',
            buttonClassName,
          )}
          onClick={onClose}
        />
      </TooltipWrapper>

      {children}
    </div>
  );
};

export { DismissiblePanel };
