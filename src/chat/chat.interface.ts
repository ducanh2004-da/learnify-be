export interface IChatService {
    getConversationChat(userId: string);
    getConversationById(conversationId: string);
    getMessages(conversationId: string, take);
    createOrGetConversationBetween(userIds: string[], title?: string);
    addMessage(conversationId: string, senderId: string, content: string);
    isUserInConversation(conversationId: string, userId: string): Promise<boolean>;
    touchConversation(conversationId: string);
    markMessagesAsRead(conversationId: string, userId: string);

}
export const CHAT_SERVICE_TOKEN = 'IChatService';
