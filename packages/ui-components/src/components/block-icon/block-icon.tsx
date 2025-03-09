import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/cn';
import { ImageWithFallback } from '../../ui/image-with-fallback';
import { Skeleton } from '../../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

const blockIconVariants = cva('flex items-center justify-center   ', {
  variants: {
    circle: {
      true: 'rounded-full bg-accent/35 p-2',
      false: 'dark:rounded-[2px]',
    },
    size: {
      xxl: 'size-[64px] p-4',
      xl: 'size-[48px]',
      lg: 'size-[40px]',
      md: 'size-[36px]',
      sm: 'size-[25px]',
    },
    border: {
      true: 'border border-solid',
    },
  },
  defaultVariants: {},
});

interface BlockIconCircleProps extends VariantProps<typeof blockIconVariants> {
  displayName?: string;
  logoUrl?: string;
  className?: string;
  showTooltip: boolean;
}

const BlockIcon = React.memo(
  ({
    displayName,
    logoUrl,
    border,
    size,
    circle = false,
    showTooltip,
    className,
  }: BlockIconCircleProps) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              blockIconVariants({ border, size, circle }),
              'dark:bg-accent-foreground/25',
              className,
            )}
          >
            {logoUrl ? (
              <ImageWithFallback
                src={logoUrl}
                alt={displayName}
                className="object-contain"
                fallback={<Skeleton className="rounded-full w-full h-full" />}
              />
            ) : (
              <Skeleton className="rounded-full w-full h-full" />
            )}
          </div>
        </TooltipTrigger>
        {showTooltip ? (
          <TooltipContent side="bottom">{displayName}</TooltipContent>
        ) : null}
      </Tooltip>
    );
  },
);

BlockIcon.displayName = 'BlockIcon';
export { BlockIcon };
