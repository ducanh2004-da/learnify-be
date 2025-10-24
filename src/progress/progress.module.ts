import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { ProgressDAO } from './progress.dao';
import { AuthModule } from '@/auth/auth.module';
import { IProgressService, PROGRESS_SERVICE_TOKEN } from './progress.interface';

@Module({
  imports: [PrismaModule, AuthModule], // Import PrismaModule
  providers: [
    {
      provide: PROGRESS_SERVICE_TOKEN,
      useClass: ProgressService
    }, 
    ProgressDAO, 
    ProgressResolver, 
    PrismaService],
  exports: [PROGRESS_SERVICE_TOKEN], // Xuất ProgressService để sử dụng ở nơi khác
})
export class ProgressModule {}
