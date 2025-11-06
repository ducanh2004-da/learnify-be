import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

  private extractTokenFromRequest(req: Request): string | undefined {
    // 1. Kiểm tra cookie trước (priority)
    if (req?.cookies && req.cookies['Authentication']) {
      return req.cookies['Authentication'];
    }

    const authHeader = req?.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx.req?.headers?.authorization;

    const req: Request = ctx?.req ?? context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.config.get<string>('JWT_ACCESS_SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      ctx.user = decoded;
      req['user'] = decoded; // gán user vào req để sử dụng trong REST API nếu cần
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const ctx: { user?: { role: Role } } =
      GqlExecutionContext.create(context).getContext();
    const user = ctx.user;

    return !!user && requiredRoles.includes(user.role);
  }
}
