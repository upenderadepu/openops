import React from 'react';

import { authenticationSession } from '@/app/lib/authentication-session';
import { Permission } from '@openops/shared';

export const useAuthorization = () => {
  const role = authenticationSession.getUserProjectRole();

  const checkAccess = React.useCallback((permission: Permission) => {
    // tbd
    return true;
  }, []);

  return { checkAccess, role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
  permission: Permission;
};

export const Authorization = ({
  permission,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (permission) {
    canAccess = checkAccess(permission);
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
