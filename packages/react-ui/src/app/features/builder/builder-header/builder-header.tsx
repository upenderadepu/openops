import { BuilderHeaderActionBar } from '@/app/features/builder/builder-header/builder-header-action-bar';
import { SideMenuCollapsed } from '@/app/features/builder/builder-header/side-menu-collapsed';
import {
  LeftSideBarType,
  useBuilderStateContext,
} from '@/app/features/builder/builder-hooks';

import { WorkflowOverview } from '@/app/features/builder/builder-header/workflow-overview/workflow-overview';
import { useAppStore } from '@/app/store/app-store';
import { BuilderPublishButton } from './builder-publish-button';
import BuilderViewOnlyWidget from './builder-view-only-widget';
import { UndoRedoActionBar } from './undo-redo-action-bar';

export const BuilderHeader = () => {
  const [leftSidebar, setLeftSidebar, readonly, flowVersion] =
    useBuilderStateContext((state) => [
      state.leftSidebar,
      state.setLeftSidebar,
      state.readonly,
      state.flowVersion,
    ]);

  const { setIsSidebarMinimized } = useAppStore((state) => ({
    setIsSidebarMinimized: state.setIsSidebarMinimized,
  }));

  const handleSidebarButtonClick = (sidebarType: LeftSideBarType) => {
    if (leftSidebar === sidebarType) {
      setLeftSidebar(LeftSideBarType.NONE);
      setIsSidebarMinimized(true);
    } else {
      setLeftSidebar(sidebarType);
      setIsSidebarMinimized(false);
    }
  };

  return (
    <div className="w-full absolute z-10 top-3 px-6 flex gap-6 justify-between @container">
      <div className="flex items-center gap-6">
        <SideMenuCollapsed
          isSideMenuCollapsed={leftSidebar !== LeftSideBarType.MENU}
          handleCollasedClick={() => {
            handleSidebarButtonClick(LeftSideBarType.MENU);
          }}
        />
        <BuilderHeaderActionBar
          leftSidebar={leftSidebar}
          handleSidebarButtonClick={handleSidebarButtonClick}
        />
        {(!readonly || flowVersion.description) && <WorkflowOverview />}
      </div>
      <div className="flex items-center gap-2">
        {readonly && <BuilderViewOnlyWidget></BuilderViewOnlyWidget>}
        {!readonly && <UndoRedoActionBar className="mx-6" />}
        <BuilderPublishButton></BuilderPublishButton>
      </div>
    </div>
  );
};
