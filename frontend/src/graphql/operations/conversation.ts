import { gql } from '@apollo/client';

import conversationFields from '../fields/conversation';

const Queries = {
  conversation: gql`
    query Conversations {
      conversations {
        ${conversationFields}
      }
    }
  `
};

const Mutations = {
  createConversation: gql`
    mutation CreateConversation($participantIds: [String]!) {
      createConversation(participantIds: $participantIds) {
        conversationId
      }
    }
  `,
  markConversationAsRead: gql`
    mutation MarkConversationAsRead($userId: String!, $conversationId: String!) {
      markConversationAsRead(userId: $userId, conversationId: $conversationId)
    }
  `
};

const Subscriptions = {
  conversationCreated: gql`
    subscription ConversationsCreated {
      conversationCreated {
        ${conversationFields}
      }
    }
  `,
  conversationUpdated: gql`
    subscription ConversationUpdated {
      conversationUpdated {
        conversation {
          ${conversationFields}
        }
      }
    }
  `
};

const conversationOperations = {
  Queries,
  Mutations,
  Subscriptions
};

export default conversationOperations;
