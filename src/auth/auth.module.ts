/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../common/providers/google.strategy';
import { AuthDAO } from './auth.dao';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // đăng ký async để lấy secret từ ConfigService; global:true để không cần import JwtModule ở nhiều module
      useFactory: async (configService: ConfigService) => {
        // ưu tiên tên biến JWT_ACCESS_SECRET để nhất quán với AuthGuard đã dùng trước đó
        const secret = configService.get<string>('JWT_ACCESS_SECRET') || configService.get<string>('JWT_SECRET');
        if (!secret) {
          // fail-fast: nếu thiếu biến môi trường thì rõ ràng báo lỗi khi app khởi động
          throw new Error('JWT_ACCESS_SECRET (or JWT_SECRET) is not set in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '12h' }, // bạn có thể thay đổi theo nhu cầu
        };
      },
      global: true,
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    AuthDAO,
    PrismaService,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtModule], // Added JwtModule to exports
})
export class AuthModule {}
