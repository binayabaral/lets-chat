import { PopulatedConversation } from '../../../backend/src/domain/prismaPopulated/Conversation';

export interface ConversationsData {
  conversations: Array<PopulatedConversation>;
}
