import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDAO } from './message.dao';
import { MessageResolver } from './message.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { PubSub } from 'graphql-subscriptions';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationDAO } from '../conversation/conversation.dao';
import { IMessageService, MESSAGE_SERVICE_TOKEN } from './message.interface';

@Module({
  imports: [PrismaModule, AuthModule, HttpModule],
  providers: [
    {
      provide: MESSAGE_SERVICE_TOKEN,
      useClass: MessageService
    },
    MessageDAO,
    MessageResolver,
    ConversationService,
    ConversationDAO,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [MESSAGE_SERVICE_TOKEN],
})
export class MessageModule { }
