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
  `
};

const Subscriptions = {
  conversationCreated: gql`
    subscription ConversationsCreated {
      conversationCreated {
        ${conversationFields}
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
