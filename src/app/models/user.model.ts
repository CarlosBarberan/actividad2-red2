export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export enum UserRole {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
