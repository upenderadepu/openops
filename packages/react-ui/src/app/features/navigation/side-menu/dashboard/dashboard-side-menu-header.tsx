import { AppLogo } from '@/app/common/components/app-logo';
import { useAppStore } from '@/app/store/app-store';
import {
  Button,
  cn,
  SideMenuHeader,
  TooltipWrapper,
} from '@openops/components/ui';
import { t } from 'i18next';
import { PanelRight } from 'lucide-react';
import { useCallback } from 'react';

const DashboardSideMenuHeader = () => {
  const { isMinimized, setIsSidebarMinimized } = useAppStore((state) => ({
    isMinimized: state.isSidebarMinimized,
    setIsSidebarMinimized: state.setIsSidebarMinimized,
  }));

  const toggleSidebar = useCallback(() => {
    setIsSidebarMinimized(!isMinimized);
  }, [isMinimized, setIsSidebarMinimized]);

  const tooltipText = isMinimized ? t('Open sidebar') : t('Close sidebar');

  return (
    <SideMenuHeader
      className={cn('justify-between overflow-hidden', {
        'justify-start pl-3': isMinimized,
      })}
      logo={isMinimized ? null : <AppLogo className="h-6" />}
    >
      <TooltipWrapper tooltipText={tooltipText} tooltipPlacement="right">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={tooltipText}
          className={cn({
            'mr-4': isMinimized,
          })}
        >
          <PanelRight className="animate-fade size-[18px]" strokeWidth="2.3" />
        </Button>
      </TooltipWrapper>
    </SideMenuHeader>
  );
};

DashboardSideMenuHeader.displayName = 'DashboardSideMenuHeader';
export { DashboardSideMenuHeader };
