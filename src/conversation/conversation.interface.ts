import {
  CreateConversationInput,
  UpdateConversationInput,
} from '@/common/model/DTO/conversation/conversation.input';
import { ConversationResponse } from '@/common/model/DTO/conversation/conversation.response';
export interface IConversationService {
    createConversation(input: CreateConversationInput): Promise<ConversationResponse>;
    getConversationById(id: string): Promise<ConversationResponse | null>;
    getConversationsByUserId(userId: string): Promise<ConversationResponse[]>;
    getAllConversations(): Promise<ConversationResponse[]>;
    updateConversation(input: UpdateConversationInput): Promise<ConversationResponse>;
    deleteConversation(id: string): Promise<ConversationResponse>;
}
export const CONVERSATION_SERVICE_TOKEN = 'IConversationService';
