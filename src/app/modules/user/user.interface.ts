export type TUserRole = 'user' | 'manager' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
};
