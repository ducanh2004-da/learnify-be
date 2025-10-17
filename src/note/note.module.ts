import { Module } from '@nestjs/common';
import { NoteResolver } from './note.resolver';
import { NoteService } from './note.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { NoteDAO } from './note.dao';


@Module({
  providers: [NoteResolver, NoteService, NoteDAO],
  imports: [PrismaModule, AuthModule],
  exports: [NoteService],
})
export class NoteModule {}
