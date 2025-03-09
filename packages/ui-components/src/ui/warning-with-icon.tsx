import React from 'react';

import { TriangleAlert } from 'lucide-react';
import { cn } from '../lib/cn';

type WarningWithIconProps = {
  message: string;
  Icon?: React.ComponentType;
  children?: React.ReactNode;
  className?: string;
};

const WarningWithIcon = ({
  Icon = TriangleAlert,
  message,
  className,
  children,
}: WarningWithIconProps) => {
  return (
    <div
      className={cn(
        'w-full p-4 flex items-center gap-3 bg-warning-50 text-warning-400 rounded-sm',
        className,
      )}
    >
      <Icon></Icon>
      <span>{message}</span>
      {children}
    </div>
  );
};

WarningWithIcon.displayName = 'WarningWithIcon';
export { WarningWithIcon };
