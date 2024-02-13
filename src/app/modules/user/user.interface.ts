export type TUserRole = 'user' | 'manager';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
};
