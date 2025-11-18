import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { IChatService, CHAT_SERVICE_TOKEN } from './chat.interface';
import { ChatGateway } from '@/common/gateways/chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  providers: [
    ChatResolver,
    {
      provide: CHAT_SERVICE_TOKEN,
      useClass: ChatService,
    },
    ChatGateway,
  ],
  exports: [CHAT_SERVICE_TOKEN],
})
export class ChatModule {}
