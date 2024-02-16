import { TUserRole } from './user.interface';

export const userRoles: TUserRole[] = ['manager', 'user', 'admin'];

export const USER_ROLE = {
  USER: 'user',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;
