const typeDefs = `#graphql
  scalar Date

  type CreateConversationResponse {
    conversationId: String
  }

  type Mutation {
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type Query {
    conversations: [Conversation]
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }
`;

export default typeDefs;
