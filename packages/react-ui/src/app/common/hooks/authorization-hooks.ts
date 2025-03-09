import React from 'react';

import { authenticationSession } from '@/app/lib/authentication-session';

export const useAuthorization = () => {
  const role = authenticationSession.getUserProjectRole();

  const checkAccess = React.useCallback(() => true, []);

  return { checkAccess, role };
};
