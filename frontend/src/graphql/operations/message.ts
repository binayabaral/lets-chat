import { gql } from '@apollo/client';

import messageFields from '../fields/message';

const Queries = {
  messages: gql`
    query Messages($conversationId: String!) {
      messages(conversationId: $conversationId) {
        ${messageFields}
      }
    }
  `
};

const Mutations = {
  sendMessage: gql`
    mutation SendMessage($id: String!, $conversationId: String!, $senderId: String!, $body: String!) {
      sendMessage(id: $id, conversationId: $conversationId, senderId: $senderId, body: $body)
    }
  `
};

const Subscriptions = {
  messageSent: gql`
    subscription MessageSent($conversationId: String!) {
      messageSent(conversationId: $conversationId) {
        ${messageFields}
      }
    }
  `
};

const messageOperations = {
  Queries,
  Mutations,
  Subscriptions
};

export default messageOperations;
