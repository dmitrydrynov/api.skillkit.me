import { UserRole } from './user.model';

export class JWTUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  role?: UserRole;
}
