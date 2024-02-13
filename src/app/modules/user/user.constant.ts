import { TUserRole } from './user.interface';

export const userRoles: TUserRole[] = ['manager', 'user'];

export const USER_ROLE = {
  USER: 'user',
  MANAGER: 'manager',
} as const;
