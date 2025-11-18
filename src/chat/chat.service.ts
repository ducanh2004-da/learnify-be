import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { IChatService, CHAT_SERVICE_TOKEN } from './chat.interface';

@Injectable()
export class ChatService implements IChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversationChat(userId: string) {
    return this.prisma.conversationChat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversationById(conversationId: string) {
    return this.prisma.conversationChat.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        messages: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async getMessages(conversationId: string, take = 50, skip = 0) {
    const messages = await this.prisma.messageChat.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take,
      skip,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
    return messages;
  }

  async createOrGetConversationBetween(userIds: string[], title?: string) {
    // Normalize unique ids
    const uniqueIds = Array.from(new Set(userIds));
    uniqueIds.sort();
    
    // 1-1 conversation
    if(uniqueIds.length === 2){
        const conversations = await this.prisma.conversationChat.findMany({
            where:{
                isGroup: false,
                participants:{
                    some: { userId: uniqueIds[0] }
                }
            },
            include:{
                participants:{
                    include: { user: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        const found = conversations.find((conv) => {
            const participantIds = conv.participants.map((p) => p.userId).sort();
            return(
                participantIds.length === 2 && participantIds[0] === uniqueIds[0] && participantIds[1] === uniqueIds[1]
            )
        });

        if(found){
            return found;
        }
    }

    // if not have conversation then create one
    const conversation = await this.prisma.conversationChat.create({
      data: {
        title,
        isGroup: uniqueIds.length > 2,
        participants: {
          create: uniqueIds.map((id) => ({ userId: id })),
        },
      },
      include: { 
        participants: { 
          include: { user: true } 
        } 
      },
    });

    return conversation;
  }

  async addMessage(conversationId: string, senderId: string, content: string) {
    // Validate sender is participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { 
        conversationId_userId: { conversationId, userId: senderId } 
      },
    });
    
    if (!participant) {
      throw new ForbiddenException('Not part of conversation');
    }

    // Create message with full sender info
    const message = await this.prisma.messageChat.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: { 
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
          }
        } 
      },
    });

    return message;
  }

  async isUserInConversation(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });
    return !!participant;
  }

  async touchConversation(conversationId: string) {
    await this.prisma.conversationChat.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await this.prisma.messageChat.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}
