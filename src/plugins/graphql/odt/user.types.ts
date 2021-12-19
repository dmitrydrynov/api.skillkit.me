import { UserRole } from '@models/User';

export class JWTUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  role?: UserRole;
}
