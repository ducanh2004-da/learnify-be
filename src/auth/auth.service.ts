import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  RegisterInput,
  LoginInput,
  GoogleLoginInput,
} from '@/common/model/DTO/auth/auth.input';
import { AuthResponse } from '@/common/model/DTO/auth/auth.response';
import { AuthResponseRegis } from '@/common/model/DTO/auth/auth.responseRegis';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDAO } from '@/auth/auth.dao';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private authDAO: AuthDAO,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  // ✅ Sửa lỗi xử lý email đã tồn tại
  async register(data: RegisterInput): Promise<AuthResponseRegis> {
    try {
      const existingUser = await this.authDAO.findUserByEmail(data.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.authDAO.createUser({
        email: data.email,
        username: data.username,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        role: Role.USER,
      });

      const { accessToken, refreshToken } = await this.signToken(user.id, user.role);
      await this.updateRefreshToken(user.id, refreshToken);

      return {
        success: true,
        message: 'User registered successfully',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // ✅ Sửa lỗi khi email không tồn tại hoặc mật khẩu sai
  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.authDAO.findUserByEmail(data.email);

    if (!user) {
      return {
        success: false,
        message: 'Email or password is incorrect',
        accessToken: undefined,
        refreshToken: undefined,
      };
    }

    const isPasswordValid = await bcrypt
      .compare(data.password, user.password)
      .catch(() => false);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Email or password is incorrect',
        accessToken: undefined,
        refreshToken: undefined,
      };
    }

    const { accessToken, refreshToken } = await this.signToken(user.id, user.role);

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  // ✅ Kiểm tra Google ID trước khi tạo user mới
  async googleLogin(data: GoogleLoginInput): Promise<AuthResponse> {
    if (!data.googleId || !data.email) {
      throw new BadRequestException('Google ID and email are required');
    }

    let user = await this.authDAO.findUserByEmail(data.email);

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await this.authDAO.createUser({
        email: data.email,
        googleId: data.googleId,
        role: Role.USER,
      });
    } else if (!user.googleId) {
      // Nếu user đã tồn tại nhưng chưa có googleId, cập nhật
      user = await this.authDAO.updateUserGoogleId(data.email, data.googleId);
    }

    const { accessToken, refreshToken } = await this.signToken(user.id, user.role);

    return {
      success: true,
      message: isNewUser
        ? 'New user created via Google login'
        : 'Google login successful',
      accessToken,
      refreshToken,
    };
  }

  // ✅ Kiểm tra context trước khi xóa JWT
  async logout(context): Promise<boolean> {
    if (
      !context ||
      !context.res ||
      typeof context.res.clearCookie !== 'function'
    ) {
      throw new UnauthorizedException('Logout failed: Invalid request context');
    }
    await this.prisma.user.update({
      where: { id: context.user?.sub },
      data: { hashedRefreshToken: null },
    });
    return true;
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // 1️⃣ Xác thực refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 2️⃣ Lấy user từ DB theo payload.sub
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 3️⃣ So sánh refresh token hash trong DB (nếu bạn lưu hash)
      if (user.hashedRefreshToken) {
        const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isMatch) throw new UnauthorizedException('Invalid refresh token');
      }

      // 4️⃣ Tạo accessToken và refreshToken mới
      const { accessToken, refreshToken: newRefreshToken } = await this.signToken(
        user.id,
        user.role
      );

      // 5️⃣ Hash refresh token mới để lưu vào DB
      await this.updateRefreshToken(user.id, newRefreshToken);

      // 6️⃣ Trả 2 token mới cho resolver
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      console.error('Refresh token error:', err);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  private async signToken(userId: string, role: Role) {
    const payload = {
      sub: userId,
      role
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '30m',
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    return {
      accessToken,
      refreshToken
    }
  }
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashRefreshToken },
    });
  }


}
