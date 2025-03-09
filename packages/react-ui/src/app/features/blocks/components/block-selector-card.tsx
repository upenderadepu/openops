import {
  BlockIcon,
  cn,
  StepMetadata,
  StepTemplateMetadata,
} from '@openops/components/ui';
import React from 'react';

type BlockCardInfoProps = {
  stepMetadata: StepMetadata;
  stepTemplateMetadata: StepTemplateMetadata;
  interactive: boolean;
  onClick?: () => void;
};

const BlockCardInfo: React.FC<BlockCardInfoProps> = ({
  stepMetadata,
  stepTemplateMetadata,
  interactive,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={cn(
      'flex items-center justify-center gap-4 rounded border border-solid p-3.5',
      {
        'cursor-pointer hover:bg-accent hover:text-accent-foreground':
          interactive,
      },
    )}
  >
    <div className="flex h-full min-w-[48px] items-center justify-center">
      <BlockIcon
        logoUrl={stepMetadata.logoUrl}
        displayName={stepMetadata.displayName}
        showTooltip
        border={false}
        size={'xl'}
      ></BlockIcon>
    </div>

    <div className="flex h-full grow flex-col justify-center gap-1 text-start">
      <div className="text-base flex">{stepTemplateMetadata.displayName}</div>
      <div className="overflow-hidden text-ellipsis text-sm text-muted-foreground">
        {stepTemplateMetadata.description}
      </div>
    </div>
  </div>
);

export { BlockCardInfo };
