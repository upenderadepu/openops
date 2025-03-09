import { Button, cn, TooltipWrapper } from '@openops/components/ui';
import { t } from 'i18next';
import { PanelRight } from 'lucide-react';

import { FlowDetailsPanel } from '../../flows/components/flow-details-panel';

type SideMenuCollapsedProps = {
  isSideMenuCollapsed: boolean;
  handleCollasedClick: () => void;
};

const SideMenuCollapsed = ({
  isSideMenuCollapsed,
  handleCollasedClick,
}: SideMenuCollapsedProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start bg-background h-12 rounded-2xl shadow-editor overflow-hidden z-50',
        {
          'p-3 max-w-[580px]': isSideMenuCollapsed,
          'p-0 max-w-0': !isSideMenuCollapsed,
        },
      )}
      style={{
        transition: 'max-width 0.1s ease-in-out, padding 0.1s ease-in-out',
      }}
    >
      {isSideMenuCollapsed && (
        <>
          <TooltipWrapper
            tooltipText={t('Open sidebar')}
            tooltipPlacement="bottom"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollasedClick}
              aria-label="Toggle Sidebar"
              className="mr-2"
            >
              <PanelRight className="size-[18px]" strokeWidth="2.3" />
            </Button>
          </TooltipWrapper>
          <FlowDetailsPanel />
        </>
      )}
    </div>
  );
};

SideMenuCollapsed.displayName = 'SideMenuCollapsed';

export { SideMenuCollapsed };
