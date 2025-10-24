import { UserResponse } from '@/common/model/DTO/user/user.response';
import { CreateUserInput, UpdateUserInput } from '@/common/model/DTO/user/user.input';

export interface IUserService {
  findAll(): Promise<UserResponse[]>;
  findOne(id: string): Promise<UserResponse>;
  create(data: CreateUserInput): Promise<UserResponse>;
  update(data: UpdateUserInput): Promise<UserResponse>;
  delete(id: string): Promise<boolean>;
}

// Token dùng để đăng ký và inject Interface vào NestJS IoC container
export const USER_SERVICE_TOKEN = 'IUserService';