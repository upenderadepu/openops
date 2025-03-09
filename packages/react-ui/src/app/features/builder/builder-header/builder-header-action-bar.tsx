import {
  Button,
  RunsIcon,
  TooltipWrapper,
  VerticalDivider,
} from '@openops/components/ui';
import { t } from 'i18next';
import { History, Workflow } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { LeftSideBarType } from '@/app/features/builder/builder-hooks';

type BuilderHeaderActionBarProps = {
  handleSidebarButtonClick: (type: LeftSideBarType) => void;
  leftSidebar: LeftSideBarType;
};

const BuilderHeaderActionBar = ({
  leftSidebar,
  handleSidebarButtonClick,
}: BuilderHeaderActionBarProps) => {
  const location = useLocation();

  const isInRunsPage = useMemo(
    () => location.pathname.startsWith('/runs'),
    [location.pathname],
  );

  const isFlowsIconActive = leftSidebar === LeftSideBarType.TREE_VIEW;

  return (
    <div className="flex items-center justify-center gap-2 bg-background p-1 rounded-xl text-primary shadow-editor z-50 contain-layout">
      <TooltipWrapper tooltipText={t('Tree view')} tooltipPlacement="bottom">
        <Button
          variant={isFlowsIconActive ? 'ghostActive' : 'ghost'}
          onClick={() => {
            handleSidebarButtonClick(LeftSideBarType.TREE_VIEW);
          }}
          className="px-2"
          aria-label="Show Tree View"
          data-testid="toggleTreeViewButton"
        >
          <Workflow className="w-6 h-6" />
        </Button>
      </TooltipWrapper>

      <VerticalDivider height={24} />

      {!isInRunsPage && (
        <>
          <TooltipWrapper
            tooltipText={t('Versions History')}
            tooltipPlacement="bottom"
          >
            <Button
              variant={
                leftSidebar === LeftSideBarType.VERSIONS
                  ? 'ghostActive'
                  : 'ghost'
              }
              className="px-2"
              onClick={() => handleSidebarButtonClick(LeftSideBarType.VERSIONS)}
              aria-label="Version History"
              data-testid="toggleHistoryButton"
            >
              <History className="w-6 h-6" />
            </Button>
          </TooltipWrapper>
          <VerticalDivider height={24} />
        </>
      )}
      <TooltipWrapper tooltipText={t('Run Logs')} tooltipPlacement="bottom">
        <Button
          variant={
            leftSidebar === LeftSideBarType.RUNS ? 'ghostActive' : 'ghost'
          }
          onClick={() => handleSidebarButtonClick(LeftSideBarType.RUNS)}
          className="px-2"
          aria-label="Run Logs"
          data-testid="toggleRunsButton"
        >
          <RunsIcon className="w-6 h-6" strokeWidth="1.5" />
        </Button>
      </TooltipWrapper>
    </div>
  );
};

BuilderHeaderActionBar.displayName = 'BuilderHeaderActionBar';
export { BuilderHeaderActionBar };
