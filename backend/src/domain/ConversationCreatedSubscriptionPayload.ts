import { PopulatedConversation } from './Conversation';

interface ConversationCreatedSubscriptionPayload {
  conversationCreated: PopulatedConversation;
}

export default ConversationCreatedSubscriptionPayload;
