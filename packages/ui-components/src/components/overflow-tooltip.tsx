import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const OverflowTooltip = ({
  text,
  className,
  tooltipPlacement = 'top',
  children,
}: {
  text: string;
  className?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  children?: (ref: any) => React.ReactNode;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkOverflow, text]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? (
          children(textRef)
        ) : (
          <span
            ref={textRef}
            className={cn(
              'text-sm dark:text-primary font-medium truncate min-w-0',
              className,
            )}
            style={{ maxWidth: '100%' }}
          >
            {text}
          </span>
        )}
      </TooltipTrigger>
      {isOverflowing && (
        <TooltipContent
          avoidCollisions
          hideWhenDetached
          side={tooltipPlacement}
          align="center"
        >
          {text}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

OverflowTooltip.displayName = 'OverflowTooltip';
export { OverflowTooltip };
