import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationDAO } from '@/conversation/conversation.dao';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConversationResolver } from '@/conversation/conversation.resolver';
import { AuthModule } from '@/auth/auth.module';
import { IConversationService, CONVERSATION_SERVICE_TOKEN } from './conversation.interface';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    ConversationDAO, 
    ConversationResolver,
    {
      provide: CONVERSATION_SERVICE_TOKEN,
      useClass: ConversationService
    }
  ],
  exports: [CONVERSATION_SERVICE_TOKEN],
})
export class ConversationModule {}
