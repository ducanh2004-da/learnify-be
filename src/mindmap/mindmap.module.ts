import { Module } from '@nestjs/common';
import { MindmapResolver } from './mindmap.resolver';
import { MindmapService } from './mindmap.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { MindMapDAO } from './mindmap.dao';
import { IMindmapService, MINDMAP_SERVICE_TOKEN } from './mindmap.interface';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    MindmapResolver, 
    {
      provide: MINDMAP_SERVICE_TOKEN,
      useClass: MindmapService
    }, 
    MindMapDAO
  ],
  exports: [MINDMAP_SERVICE_TOKEN]
})
export class MindmapModule {}
