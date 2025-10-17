import { Module } from '@nestjs/common';
import { MindmapResolver } from './mindmap.resolver';
import { MindmapService } from './mindmap.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { MindMapDAO } from './mindmap.dao';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [MindmapResolver, MindmapService, MindMapDAO],
  exports: [MindmapService]
})
export class MindmapModule {}
