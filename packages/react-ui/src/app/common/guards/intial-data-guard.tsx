import { LoadingSpinner } from '@openops/components/ui';
import { Suspense } from 'react';

import { flagsHooks } from '@/app/common/hooks/flags-hooks';

type InitialDataGuardProps = {
  children: React.ReactNode;
};
export const InitialDataGuard = ({ children }: InitialDataGuardProps) => {
  flagsHooks.prefetchFlags();

  return (
    <Suspense
      fallback={
        <div className="bg-background flex h-screen w-screen items-center justify-center ">
          <LoadingSpinner size={50}></LoadingSpinner>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
