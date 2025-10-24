import { Module } from '@nestjs/common';
import { NoteResolver } from './note.resolver';
import { NoteService } from './note.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { NoteDAO } from './note.dao';
import { INoteService, NOTE_SERVICE_TOKEN } from './note.interface';

@Module({
  providers: [
    NoteResolver, 
    {
      provide: NOTE_SERVICE_TOKEN,
      useClass: NoteService
    }, 
    NoteDAO
  ],
  imports: [PrismaModule, AuthModule],
  exports: [NOTE_SERVICE_TOKEN],
})
export class NoteModule {}
