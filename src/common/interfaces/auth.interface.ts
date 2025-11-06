import { Role } from '@prisma/client';
export interface AuthContext {
  user: {
    sub: string;
    role: Role;
  };
}
