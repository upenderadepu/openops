import { AuthenticationResponse } from '@openops/shared';
import {
  OpenOpsCloudConfig,
  UserAvatarDropdownMenuContent,
  UserAvatarMenu,
} from '../../ui/user-avatar-menu';
import { MenuNavigationItem } from './menu-navigation-item';
import { MenuLink } from './types';

export type MenuFooterProps = {
  settingsLink: MenuLink;
  user: AuthenticationResponse | null;
  onLogout: () => void;
  isMinimized: boolean;
  cloudConfig: OpenOpsCloudConfig;
};

const MenuFooter = ({
  settingsLink,
  user,
  onLogout,
  isMinimized,
  cloudConfig,
}: MenuFooterProps) => (
  <div className="w-full flex justify-between items-center px-6 pt-[18px] pb-6 border-t flex-col gap-1 h-[146px] @[180px]:py-4 @[180px]:flex-row @[180px]:h-[64px]">
    <MenuNavigationItem
      to={settingsLink.to}
      label={settingsLink.label}
      Icon={settingsLink.icon}
      iconClassName="@[180px]:size-6"
      className="@[180px]:gap-2"
      isMinimized={isMinimized}
    ></MenuNavigationItem>
    <UserAvatarMenu
      user={
        user
          ? {
              email: user.email ?? '',
            }
          : undefined
      }
      MenuContent={
        <UserAvatarDropdownMenuContent
          cloudConfig={cloudConfig}
          onLogout={onLogout}
          user={user}
        />
      }
    />
  </div>
);

MenuFooter.displayName = 'MenuFooter';
export { MenuFooter };
