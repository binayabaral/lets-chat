import messageFields from './message';

const conversationFields = `
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${messageFields}
  }
  updatedAt
`;
export default conversationFields;
