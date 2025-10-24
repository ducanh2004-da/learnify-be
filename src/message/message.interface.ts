import {
  CreateMessageInput,
  UpdateMessageInput,
  CreateMessage2Input
} from '@/common/model/DTO/message/message.input';
import { MessageResponse } from '@/common/model/DTO/message/message.response';
export interface IMessageService {
    getMessageById(id: string): Promise<MessageResponse | null>;
    getMessagesByConversationId(conversationId: string,): Promise<MessageResponse[]>;
    updateMessage(input: UpdateMessageInput): Promise<MessageResponse>;
    deleteMessage(id: string): Promise<MessageResponse>;
    deleteMessagesByConversationId(conversationId: string,): Promise<number>;
    streamChatFromFastApi(data: CreateMessage2Input): Promise<MessageResponse>;
}
export const MESSAGE_SERVICE_TOKEN = 'IMessageService';
