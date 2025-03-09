import { cn } from '../../../lib/cn';

type ExploreTemplatesFilterItemProps = {
  value: string;
  isActive: boolean;
  onClick: () => void;
};

export const ExploreTemplatesFilterItem = ({
  value,
  isActive,
  onClick,
}: ExploreTemplatesFilterItemProps) => {
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-full bg-secondary text-primary-400 dark:text-primary cursor-pointer',
        {
          'border border-primary-200': isActive,
        },
      )}
      tabIndex={0}
      aria-selected={isActive}
      role="option"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClick();
        }
      }}
    >
      {value}
    </div>
  );
};
