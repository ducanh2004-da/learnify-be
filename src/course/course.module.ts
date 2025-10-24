// course.module.ts
import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { CourseDAO } from './course.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { ICourseService, COURSE_SERVICE_TOKEN } from './course.interface';

@Module({
  imports: [PrismaModule, AuthModule], // Import PrismaModule
  providers: [
    CourseResolver, 
    CourseDAO,
    {
      provide: COURSE_SERVICE_TOKEN,
      useClass: CourseService
    }
  ],
  exports: [COURSE_SERVICE_TOKEN],
})
export class CourseModule {}
