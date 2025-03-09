import { cn } from '../lib/cn';

export function TextWithIcon({
  icon,
  text,
  className = '',
  children,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon}
      {text}
      {children}
    </div>
  );
}
