import { PopulatedConversation } from '../prismaPopulated/Conversation';

interface ConversationCreated {
  conversationCreated: PopulatedConversation;
}

export default ConversationCreated;
