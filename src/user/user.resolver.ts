import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse } from '@/common/model/DTO/user/user.response';
import { CreateUserInput, UpdateUserInput } from '@/common/model/DTO/user/user.input';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '@/common/guards/auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { AuthContext } from '@/common/interfaces/auth.interface';
import { IUserService, USER_SERVICE_TOKEN } from './user.interface';

@Resolver(() => UserResponse)
@UseGuards(AuthGuard, RolesGuard)
export class UserResolver {
  constructor(@Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService) {}

  @Query(() => [UserResponse], { name: 'users' })
  @Roles('INSTRUCTOR')
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserResponse, { name: 'user' })
  @Roles('USER', 'INSTRUCTOR')
  async findOne(
    @Context() ctx: any,
  ) {
    // Users can only view their own profile unless they're an INSTRUCTOR
    // if (ctx.user.role !== 'INSTRUCTOR') {
    //   throw new Error('You can only view your own profile');
    // }
    const userId = ctx?.user?.sub ?? null;
    return this.userService.findOne(userId);
  }

  @Mutation(() => UserResponse, { name: 'createUser' })
  @Roles('INSTRUCTOR')
  async create(
    @Args('data', { type: () => CreateUserInput }) data: CreateUserInput,
  ) {
    return this.userService.create(data);
  }

  @Mutation(() => UserResponse, { name: 'updateUser' })
  @Roles('USER', 'INSTRUCTOR')
  async update(
    @Args('data', { type: () => UpdateUserInput }) data: UpdateUserInput,
    @Context() ctx: AuthContext,
  ) {
    // Users can only update their own profile unless they're an INSTRUCTOR
    if (ctx.user.role !== 'INSTRUCTOR' && data.id !== ctx.user?.sub) {
      throw new Error('You can only update your own profile');
    }
    return this.userService.update(data);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @Roles('INSTRUCTOR')
  async delete(@Args('id', { type: () => String }) id: string) {
    return this.userService.delete(id);
  }
}