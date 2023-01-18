import { gql } from '@apollo/client';

import conversationFields from '../fields/conversation';

const Queries = {
  conversation: gql`
    query Conversations {
      ${conversationFields}
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

const Subscriptions = {};

const conversationOperations = {
  Queries,
  Mutations,
  Subscriptions
};

export default conversationOperations;
