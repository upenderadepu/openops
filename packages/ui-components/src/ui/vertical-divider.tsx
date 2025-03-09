import { cn } from '../lib/cn';

type VerticalDividerProps = {
  height?: number | string;
  className?: string;
};

const VerticalDivider = ({ height, className }: VerticalDividerProps) => {
  return (
    <div className={cn('w-px bg-gray-300', `h-[${height}px]`, className)} />
  );
};

VerticalDivider.displayName = 'VerticalDivider';
export { VerticalDivider };
