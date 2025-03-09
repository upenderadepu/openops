import { AppConnectionStatus } from '@openops/shared';
import { CheckIcon, XIcon } from 'lucide-react';

export const appConnectionUtils = {
  findName(blockName: string) {
    const split = blockName.replaceAll('_', ' ').split('/');
    return split[split.length - 1].replaceAll('block-', '');
  },
  getStatusIcon(status: AppConnectionStatus): {
    variant: 'default' | 'success' | 'error';
    icon: React.ComponentType;
  } {
    switch (status) {
      case AppConnectionStatus.ACTIVE:
        return {
          variant: 'success',
          icon: CheckIcon,
        };
      case AppConnectionStatus.ERROR:
        return {
          variant: 'error',
          icon: XIcon,
        };
    }
  },
};
