import { userSettingsHooks } from '@/app/common/hooks/user-settings-hooks';
import { useAppStore } from '@/app/store/app-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TooltipWrapper,
} from '@openops/components/ui';
import { t } from 'i18next';
import { CircleHelp } from 'lucide-react';

const HomeHelpDropdown = () => {
  const { updateUserSettings } = userSettingsHooks.useUpdateUserSettings();
  const { isHelpViewClosed } = useAppStore((state) => ({
    isHelpViewClosed: state.userSettings.isHelpViewClosed,
  }));

  return (
    <DropdownMenu modal={true}>
      <TooltipWrapper tooltipText={t('Help')} tooltipPlacement="top">
        <DropdownMenuTrigger asChild>
          <div className="h-10 flex items-center">
            <CircleHelp className="size-6" role="button" />
          </div>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={!isHelpViewClosed}
          onSelect={(e) => {
            updateUserSettings({ isHelpViewClosed: false });
          }}
        >
          {t('Get started')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HomeHelpDropdown.displayName = 'HomeHelpDropdown';
export { HomeHelpDropdown };
