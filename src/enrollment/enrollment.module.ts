import { Module } from '@nestjs/common';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EnrollmentDAO } from '@/enrollment/enrollment.dao';
import { AuthModule } from '@/auth/auth.module';
import { IEnrollmentService, ENROLLMENT_SERVICE_TOKEN } from './enrollment.interface';

@Module({
  imports: [PrismaModule, AuthModule], // Import PrismaModule
  providers: [
    EnrollmentResolver,
    EnrollmentDAO,
    {
      provide: ENROLLMENT_SERVICE_TOKEN,
      useClass: EnrollmentService
    },
    PrismaService,
  ],
  exports: [ENROLLMENT_SERVICE_TOKEN], // Xuất EnrollmentService để sử dụng ở nơi khác
})
export class EnrollmentModule {}
