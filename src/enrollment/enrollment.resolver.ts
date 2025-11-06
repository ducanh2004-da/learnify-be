import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentInput } from '@/common/model/DTO/enrollment/enrollment.input';
import { EnrollmentResponse } from '@/common/model/DTO/enrollment/enrollment.response';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthContext } from '../common/interfaces/auth.interface';
import { CompleteCourseResponse } from '@/common/model/DTO/profile/completeCourse.response';
import { InProgressCourseResponse } from '@/common/model/DTO/profile/inProgressCourse.response';
import { IEnrollmentService, ENROLLMENT_SERVICE_TOKEN } from './enrollment.interface';

@Resolver(() => EnrollmentResponse)
@UseGuards(AuthGuard, RolesGuard)
export class EnrollmentResolver {
  constructor(@Inject(ENROLLMENT_SERVICE_TOKEN) private readonly enrollmentService: IEnrollmentService) { }

  @Mutation(() => EnrollmentResponse)
  @Roles('USER', 'INSTRUCTOR')
  async enrollCourse(
    @Args('input') input: CreateEnrollmentInput,
    @Context() ctx: AuthContext,
  ): Promise<EnrollmentResponse> {
    // Ensure users can only enroll themselves unless they're an INSTRUCTOR
    if (ctx.user.role !== 'INSTRUCTOR' && input.userId !== ctx.user?.sub) {
      throw new Error('You can only enroll yourself in courses');
    }
    return this.enrollmentService.enrollUserToCourse(input);
  }

  @Query(() => [EnrollmentResponse])
  @Roles('USER', 'INSTRUCTOR')
  async getUserEnrollments(
    @Args('userId') userId: string,
    @Context() ctx: AuthContext,
  ): Promise<EnrollmentResponse[]> {
    // Users can only view their own enrollments unless they're an INSTRUCTOR
    if (ctx.user.role !== 'INSTRUCTOR' && userId !== ctx.user?.sub) {
      throw new Error('You can only view your own enrollments');
    }
    return this.enrollmentService.getUserEnrollments(userId);
  }

  @Query(() => CompleteCourseResponse, { nullable: true })
  async countSuccessEnrollments(
    @Args('userId') userId: string,
  ): Promise<CompleteCourseResponse | null> {
    // trả thẳng số lượng
    return this.enrollmentService.countSuccessEnrollments(userId);
  }

  @Query(() => InProgressCourseResponse, { nullable: true })
  async countInProgressEnrollments(
    @Args('userId') userId: string,
  ): Promise<InProgressCourseResponse | null> {
    // trả thẳng số lượng
    return this.enrollmentService.countInProgressEnrollments(userId);
  }

}
