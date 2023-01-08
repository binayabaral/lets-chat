import { gql } from '@apollo/client';

const Queries = {};

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
