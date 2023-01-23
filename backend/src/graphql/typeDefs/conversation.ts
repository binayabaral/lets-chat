const typeDefs = `#graphql
  scalar Date

  type CreateConversationResponse {
    conversationId: String
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

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type Query {
    conversations: [Conversation]
  }

  type Subscription {
    conversationCreated: Conversation
  }
`;

export default typeDefs;
