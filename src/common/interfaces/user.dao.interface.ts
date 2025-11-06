// src/user/dao/interfaces/user.dao.interface.ts
import { User } from '@prisma/client';
import { Role } from '@prisma/client';

export interface IUserDAO {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: Role;
  }): Promise<User>;
  update(id: string, data: {
    username?: string;
    email?: string;
    phoneNumber?: string;
  }): Promise<User>;
  delete(id: string): Promise<void>;
}
