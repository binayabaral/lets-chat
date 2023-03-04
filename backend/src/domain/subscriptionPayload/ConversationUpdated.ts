import { PopulatedConversation } from '../prismaPopulated/Conversation';

interface ConversationUpdated {
  conversationUpdated: { conversation: PopulatedConversation };
}

export default ConversationUpdated;
