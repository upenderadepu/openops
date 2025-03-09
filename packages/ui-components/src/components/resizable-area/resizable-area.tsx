import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResizeIcon from '../../icons/resize-icon';
import { cn } from '../../lib/cn';
import { ScrollArea } from '../../ui/scroll-area';

interface ResizableAreaProps {
  initialWidth: number;
  initialHeight: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  children: React.ReactNode;
  className?: string;
}

export function ResizableArea({
  initialWidth,
  initialHeight,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  children,
  className,
}: ResizableAreaProps) {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      setDimensions({
        width: Math.min(
          Math.max(startPosRef.current.width + dx, minWidth),
          maxWidth,
        ),
        height: Math.min(
          Math.max(startPosRef.current.height + dy, minHeight),
          maxHeight,
        ),
      });
    },
    [minWidth, maxWidth, minHeight, maxHeight],
  );

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = resizeRef.current?.getBoundingClientRect();
    if (rect) {
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      };
      isResizingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={resizeRef}
      className={cn('relative p-4 pr-0', className)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        touchAction: 'none',
      }}
    >
      <ScrollArea className="w-full h-full pr-3">{children}</ScrollArea>

      <ResizeIcon
        className="absolute bottom-1 right-1 w-3 h-3 cursor-nwse-resize pointer-events-auto text-primary/40"
        onMouseDown={startResize}
      ></ResizeIcon>
    </div>
  );
}
