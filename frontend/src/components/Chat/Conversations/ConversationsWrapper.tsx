import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';

import { Box } from '@chakra-ui/react';

import ConversationList from './ConversationList';
import { ConversationsData } from '../../../domain/Conversation';
import conversationOperations from '../../../graphql/operations/conversation';

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading
  } = useQuery<ConversationsData, null>(conversationOperations.Queries.conversation);

  console.log(conversationsData);
  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py="6" px="3">
      <ConversationList session={session} conversations={conversationsData?.conversations || []} />
    </Box>
  );
};

export default ConversationsWrapper;
