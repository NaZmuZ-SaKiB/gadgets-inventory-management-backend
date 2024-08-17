export type TUserRole = 'user' | 'manager' | 'admin';

export type TUser = {
  name: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
  permanentAddress?: string;
  presentAddress?: string;
  gender?: 'male' | 'female';
  password: string;
  role: TUserRole;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationShip?: string;
    occupation?: string;
  };
  employmentStatus?: 'full-time' | 'part-time';
  workLocation: 'on-site' | 'remote';
  employeeType?: 'permanent' | 'temporary' | 'intern';
  salary?: number;
  joiningDate?: string;
  image?: string;
};
