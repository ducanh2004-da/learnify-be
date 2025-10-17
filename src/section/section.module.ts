import { Module } from '@nestjs/common';
import { SectionResolver } from './section.resolver';
import { SectionService } from './section.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { SectionDAO } from './section.dao';


@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SectionResolver, SectionService, SectionDAO],
  exports: [SectionService],
})
export class SectionModule {}
