export type TUserRole = 'user' | 'manager' | 'admin';

export type TUser = {
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  phone?: string;
  permanentAddress?: string;
  presentAddress?: string;
  password: string;
  role: TUserRole;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationShip?: string;
  };
  employmentStatus?: 'full-time' | 'part-time';
  workLocation: 'on-site' | 'remote';
  employeeType?: 'permanent' | 'temporary' | 'intern';
  salary?: number;
  joiningDate?: string;
  image?: string;
};
