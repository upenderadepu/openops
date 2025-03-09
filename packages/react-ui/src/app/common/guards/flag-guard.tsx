import { flagsHooks } from '@/app/common/hooks/flags-hooks';
import { FlagId } from '@openops/shared';

type FlagGuardProps = {
  children: React.ReactNode;
  flag: FlagId;
};
const FlagGuard = ({ children, flag }: FlagGuardProps) => {
  const { data: flagValue } = flagsHooks.useFlag<boolean>(flag);
  if (!flagValue) {
    return null;
  }
  return children;
};

FlagGuard.displayName = 'FlagGuard';
export { FlagGuard };
