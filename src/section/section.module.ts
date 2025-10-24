import { Module } from '@nestjs/common';
import { SectionResolver } from './section.resolver';
import { SectionService } from './section.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { SectionDAO } from './section.dao';
import { ISectionService, SECTION_SERVICE_TOKEN } from './section.interface';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    SectionResolver, 
    {
      provide: SECTION_SERVICE_TOKEN,
      useClass: SectionService
    }, 
    SectionDAO],
  exports: [SECTION_SERVICE_TOKEN],
})
export class SectionModule {}
