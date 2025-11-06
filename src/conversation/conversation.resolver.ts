import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResponse } from '@/common/model/DTO/conversation/conversation.response';
import {
  CreateConversationInput,
  UpdateConversationInput,
} from '@/common/model/DTO/conversation/conversation.input';
import { AuthGuard, RolesGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthContext } from '../common/interfaces/auth.interface';
import { IConversationService, CONVERSATION_SERVICE_TOKEN } from './conversation.interface';

@Resolver(() => ConversationResponse)
@UseGuards(AuthGuard, RolesGuard)
export class ConversationResolver {
  constructor(@Inject(CONVERSATION_SERVICE_TOKEN) private readonly conversationService: IConversationService) {}

  @Query(() => [ConversationResponse])
  @Roles('USER', 'INSTRUCTOR')
  async myConversations(
    @Context() ctx: AuthContext,
  ): Promise<ConversationResponse[]> {
    return this.conversationService.getConversationsByUserId(ctx.user?.sub);
  }

  @Query(() => ConversationResponse, { nullable: true })
  @Roles('USER', 'INSTRUCTOR')
  async conversation(
    @Args('id') id: string,
    @Context() ctx: AuthContext,
  ): Promise<ConversationResponse | null> {
    const conversation = await this.conversationService.getConversationById(id);
    if (conversation && conversation.creatorId !== ctx.user?.sub) {
      throw new Error('Unauthorized to access this conversation');
    }
    return conversation;
  }

  @Mutation(() => ConversationResponse)
  @Roles('USER', 'INSTRUCTOR')
  async createConversation(
    @Args('data') input: CreateConversationInput,
    @Context() ctx: AuthContext,
  ): Promise<ConversationResponse> {
    return this.conversationService.createConversation({
      ...input,
      creatorId: ctx.user?.sub,
    });
  }

  @Mutation(() => ConversationResponse)
  @Roles('USER', 'INSTRUCTOR')
  async updateConversation(
    @Args('data') input: UpdateConversationInput,
    @Context() ctx: AuthContext,
  ): Promise<ConversationResponse> {
    const conversation = await this.conversationService.getConversationById(
      input.id,
    );
    if (!conversation || conversation.creatorId !== ctx.user?.sub) {
      throw new Error('Unauthorized to update this conversation');
    }
    return this.conversationService.updateConversation(input);
  }

  @Mutation(() => ConversationResponse)
  @Roles('USER', 'INSTRUCTOR')
  async deleteConversation(
    @Args('id') id: string,
    @Context() ctx: AuthContext,
  ): Promise<ConversationResponse> {
    const conversation = await this.conversationService.getConversationById(id);
    if (!conversation || conversation.creatorId !== ctx.user?.sub) {
      throw new Error('Unauthorized to delete this conversation');
    }
    return this.conversationService.deleteConversation(id);
  }
}
