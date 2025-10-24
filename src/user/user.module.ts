import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserDAO } from './user.dao';
import { AuthModule } from '@/auth/auth.module';
import { IUserDAO } from '../common/interfaces/user.dao.interface';
import { PrismaModule } from '@/prisma/prisma.module';
import { IUserService, USER_SERVICE_TOKEN } from './user.interface';
 
@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    UserResolver,
    PrismaService,
    UserDAO,
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    }
  ],
  exports: [USER_SERVICE_TOKEN],
})
export class UserModule {}
