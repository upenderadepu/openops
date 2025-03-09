import { t } from 'i18next';
import { lazy, useRef } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../../ui/button';

type Props = {
  className?: string;
  onExploreMoreClick: () => void;
};

const Background = lazy(() => import('./explore-more-background'));

const ExploreTemplates = ({ onExploreMoreClick, className }: Props) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'w-full h-[268px] min-w-[480px] max-w-[1024px] bg-cover bg-center bg-no-repeat relative px-4',
        className,
      )}
    >
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        ref={svgContainerRef}
      >
        <Background />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center max-w-xl mx-auto px-4">
        <h2 className="text-base font-semibold text-gray-900">
          {t(`Browse for more templates`)}
        </h2>
        <p className="text-center mb-4 mt-1 z-10 lg:px-12 xl:px-10">
          {t(
            `Explore templates by FinOps capabilities and different services. Log in to our cloud platform to access them all for free.`,
          )}
        </p>
        <Button onClick={onExploreMoreClick} variant="default">
          {t(`Explore more`)}
        </Button>
      </div>
    </div>
  );
};

ExploreTemplates.displayName = 'ExploreTemplates';

export { ExploreTemplates };
