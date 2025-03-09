import { AuthUser, makeOpenOpsTablesPost } from '@openops/common';

export async function createUser(values: {
  name: string;
  email: string;
  password: string;
  authenticate?: boolean;
}): Promise<AuthUser> {
  const requestBody = {
    name: values.name,
    email: values.email,
    password: values.password,
    authenticate: values.authenticate ?? false,
  };

  return makeOpenOpsTablesPost<AuthUser>('api/user/', requestBody);
}
