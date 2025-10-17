import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonDAO } from './lesson.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { ProgressModule } from '@/progress/progress.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, AuthModule, ProgressModule, HttpModule], // Import PrismaModule
  providers: [LessonService, LessonResolver, LessonDAO],
  exports: [LessonService],
})
export class LessonModule {}
