import { Module } from '@nestjs/common';
import { DocumentsResolver } from './document.resolver';
import { DocumentsService } from './document.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule,AuthModule, CloudinaryModule],
  providers: [DocumentsResolver, DocumentsService],
  exports: [DocumentsService]
})
export class DocumentModule {}
