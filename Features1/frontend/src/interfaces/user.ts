export type UserRole = 'CUSTOMER' | 'ORGANIZER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserTokenPayload {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
