import { PopulatedConversation } from '../../../backend/src/domain/prismaPopulated/Conversation';

export interface UpdatedConversationData {
  conversationUpdated: {
    conversation: PopulatedConversation;
  };
}
