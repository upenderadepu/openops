import { t } from 'i18next';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '../../../ui/carousel';
import {
  ExploreTemplatesCarouselContent,
  ExploreTemplatesCarouselContentProps,
} from './explore-templates-carousel-content';
import { ExploreTemplatesFilterItem } from './templates-carousel-filter-item';

type ExploreTemplatesCarouselProps = {
  showFilters: boolean;
  filters: string[];
  onFilterClick: (filter: string) => void;
  onSeeAllClick: () => void;
} & ExploreTemplatesCarouselContentProps;

const ExploreTemplatesCarousel = ({
  showFilters,
  filters,
  templates,
  onFilterClick,
  onTemplateClick,
  onSeeAllClick,
}: ExploreTemplatesCarouselProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const onFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    onFilterClick(filter);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-primary font-bold text-[24px] leading-none">
        {t('Explore our templates')}
      </h2>
      {showFilters && (
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-black dark:text-white">
              {t('Filter by:')}
            </span>
            <Button
              variant="link"
              className="h-fit p-0"
              onClick={onSeeAllClick}
            >
              <span className="text-base ">{t('See all')}</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <ExploreTemplatesFilterItem
              value={t('All templates')}
              isActive={selectedFilter === ''}
              onClick={() => {
                onFilterSelect('');
              }}
            />
            {filters.map((filter) => (
              <ExploreTemplatesFilterItem
                key={filter}
                value={filter}
                isActive={selectedFilter === filter}
                onClick={() => {
                  onFilterSelect(filter);
                }}
              />
            ))}
          </div>
        </div>
      )}
      <Carousel>
        <CarouselContent className="w-full gap-4 items-start">
          <ExploreTemplatesCarouselContent
            templates={templates}
            onTemplateClick={onTemplateClick}
          />
        </CarouselContent>
        {!!templates && !!templates.length && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
};

ExploreTemplatesCarousel.displayName = 'ExploreTemplatesCarousel';
export { ExploreTemplatesCarousel };
