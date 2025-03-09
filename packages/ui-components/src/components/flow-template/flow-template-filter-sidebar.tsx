import { t } from 'i18next';
import { cn } from '../../lib/cn';
import { ScrollArea } from '../../ui/scroll-area';
import { TooltipProvider } from '../../ui/tooltip';
import { OverflowTooltip } from '../overflow-tooltip';

type FlowTemplateFilterItemProps = {
  value: string;
  displayName: string;
  onClick: (id: string) => void;
  isActive: boolean;
};

const FlowTemplateFilterItem = ({
  value,
  displayName,
  isActive,
  onClick,
}: FlowTemplateFilterItemProps) => (
  <div
    aria-selected={isActive}
    role="option"
    className={cn(
      'w-full px-3 py-3 justify-start items-start gap-2.5 inline-flex overflow-hidden cursor-pointer hover:bg-muted',
      {
        'bg-muted': isActive,
      },
    )}
    onClick={() => onClick(value)}
  >
    <TooltipProvider>
      <OverflowTooltip
        text={displayName}
        className="w-full font-normal text-slate-600 dark:text-primary text-base leading-snug truncate select-none"
      />
    </TooltipProvider>
  </div>
);

FlowTemplateFilterItem.displayName = 'FlowTemplateFilterItem';

const FlowTemplateFilterHeader = ({ title }: { title: string }) => (
  <div className="h-16 px-3 py-3 justify-start items-end gap-2.5 inline-flex overflow-hidden">
    <span className="text-slate-600 dark:text-primary text-base font-bold leading-snug truncate">
      {title}
    </span>
  </div>
);

FlowTemplateFilterHeader.displayName = 'FlowTemplateFilterHeader';

type FlowTemplateFilterSidebarProps = {
  domains: string[];
  services: string[];
  selectedDomains: string[];
  selectedServices: string[];
  onDomainFilterClick: (domain: string) => void;
  onServiceFilterClick: (service: string) => void;
  clearFilters: () => void;
};

const FlowTemplateFilterSidebar = ({
  domains,
  services,
  selectedDomains,
  selectedServices,
  onDomainFilterClick,
  onServiceFilterClick,
  clearFilters,
}: FlowTemplateFilterSidebarProps) => {
  return (
    <div className="rounded-2xl flex-col justify-start items-start inline-flex h-full w-full px-4 pt-[25px] pb-8 bg-background">
      <FlowTemplateFilterItem
        value={''}
        displayName={t('All Templates')}
        onClick={clearFilters}
        isActive={selectedDomains.length === 0 && selectedServices.length === 0}
      />
      <FlowTemplateFilterHeader title={t('FinOps capabilities')} />
      <ScrollArea className="max-h-[40%] w-full">
        <div className="flex flex-col w-full">
          {domains.map((domain) => (
            <FlowTemplateFilterItem
              key={domain}
              value={domain}
              displayName={domain}
              onClick={onDomainFilterClick}
              isActive={selectedDomains.includes(domain)}
            />
          ))}
        </div>
      </ScrollArea>
      <FlowTemplateFilterHeader title={t('Services')} />
      <ScrollArea className="max-h-[40%] w-full">
        <div className="flex flex-col w-full">
          {services.map((service) => (
            <FlowTemplateFilterItem
              key={service}
              value={service}
              displayName={service}
              onClick={onServiceFilterClick}
              isActive={selectedServices.includes(service)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

FlowTemplateFilterSidebar.displayName = 'FlowSidebar';

export { FlowTemplateFilterSidebar };
