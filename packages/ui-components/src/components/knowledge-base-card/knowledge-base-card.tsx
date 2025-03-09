import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type KnowledgeBaseCardProps = {
  link: string;
  text: string;
  icon: ReactNode;
  iconWrapperClassName?: string;
  className?: string;
};

const KnowledgeBaseCard = ({
  link,
  text,
  iconWrapperClassName,
  icon,
  className,
}: KnowledgeBaseCardProps) => {
  return (
    <a
      href={link}
      className={cn(
        'w-full h-full min-w-[118px] p-4 pr-2 flex flex-col gap-[18px] border rounded-sm bg-background',
        className,
      )}
      aria-label={text}
    >
      <div
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-full bg-blue-300 text-background',
          iconWrapperClassName,
        )}
      >
        {icon}
      </div>
      <span className=" text-foreground">{text}</span>
    </a>
  );
};

KnowledgeBaseCard.displayName = 'KnowledgeBaseCard';
export { KnowledgeBaseCard };
