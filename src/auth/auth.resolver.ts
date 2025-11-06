import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  RegisterInput,
  LoginInput,
  GoogleLoginInput,
} from '@/common/model/DTO/auth/auth.input';
import { AuthResponse, GenericResponse } from '@/common/model/DTO/auth/auth.response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator'; // Import Custom Decorator
import { Auth } from './auth.interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => GenericResponse)
  async register(@Args('data') data: RegisterInput, @Context() ctx: any) {
    const user = await this.authService.register(data);
    if (user?.success && user.refreshToken && user.accessToken) {
      this.setAuthCookies(ctx.res, user?.accessToken, user?.refreshToken);
    }
    return {
      success: user.success,
      message: user.message
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginInput, @Context() ctx: any): Promise<AuthResponse> {
    const user = await this.authService.login(data);
    if (user?.success && user.accessToken && user.refreshToken) {
      this.setAuthCookies(ctx.res, user.accessToken, user.refreshToken);
      return {
        success: true,
        message: '',
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      };
    } else {
      return {
        success: false,
        message: user?.message || 'Login failed',
      }
    }
  }

  @Mutation(() => AuthResponse)
  async googleLogin(@Args('data') data: GoogleLoginInput) {
    return this.authService.googleLogin(data);
  }

  @Mutation(() => GenericResponse)
  async refresh(@Context() ctx: any): Promise<GenericResponse> {
    const refreshToken = ctx.req.cookies?.Refresh;

    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token provided'
      };
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);

      this.setAuthCookies(ctx.res, accessToken, newRefreshToken);

      return {
        success: true,
        message: 'Tokens refreshed successfully'
      };
    } catch (error) {
      this.clearAuthCookies(ctx.res);
      return {
        success: false,
        message: 'Token refresh failed'
      };
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(AuthGuard)
  async logout(@Context() context: any) {
    const logoutResult = await this.authService.logout(context);
    await this.clearAuthCookies(context.res);
    if (!logoutResult) {
      return { success: false, message: 'Logged out failed' };
    }
    return { success: true, message: 'Logged out' };
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  hello() {
    return 'Hello World!';
  }

  @Query(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INSTRUCTOR') // Đúng cách truyền role
  INSTRUCTOR() {
    return 'Hello INSTRUCTOR!';
  }

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    // Access Token - 15 minutes
    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh Token - 7 days
    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAuthCookies(res: any): void {
    res.clearCookie('Authentication', { path: '/' });
    res.clearCookie('Refresh', { path: '/' });
  }
}
