import { User } from './user';

export type AuthUser = {
  user: User;
  token: string;
  refresh_token: string;
};
