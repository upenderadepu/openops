import {
  ScrollArea,
  SideMenu,
  SideMenuNavigation,
} from '@openops/components/ui';

import { MENU_LINKS } from '@/app/constants/menu-links';
import { FlowDetailsPanel } from '@/app/features/flows/components/flow-details-panel';
import { FolderFilterList } from '@/app/features/folders/component/folder-filter-list';
import { FlowSideMenuHeader } from '@/app/features/navigation/side-menu/flow/flow-side-menu-header';
import { SideMenuFooter } from '@/app/features/navigation/side-menu/side-menu-footer';

export function FlowSideMenu() {
  return (
    <SideMenu MenuHeader={FlowSideMenuHeader} MenuFooter={SideMenuFooter}>
      <div className="flex items-center gap-2 px-6 pb-4">
        <FlowDetailsPanel wrapNavItems />
      </div>
      <SideMenuNavigation links={MENU_LINKS} isMinimized={false} />
      <ScrollArea className="border-t">
        <FolderFilterList />
      </ScrollArea>
    </SideMenu>
  );
}
