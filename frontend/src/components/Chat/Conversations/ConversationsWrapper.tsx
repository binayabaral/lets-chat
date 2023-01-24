import { useEffect } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import { Box } from '@chakra-ui/react';

import ConversationList from './ConversationList';
import { ConversationsData } from '../../../domain/Conversation';
import conversationOperations from '../../../graphql/operations/conversation';
import { PopulatedConversation } from '../../../../../backend/src/domain/prismaPopulated/Conversation';

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore
  } = useQuery<ConversationsData, null>(conversationOperations.Queries.conversation);

  const router = useRouter();
  const {
    query: { conversationId }
  } = router;

  const onViewConversation = async (conversationId: string) => {
    // 1. Push the conversation id to url
    router.push({ query: { conversationId } });
    // 2. Mark the conversation as read
  };

  useEffect(() => {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: { data: { conversationCreated: PopulatedConversation } } }
      ) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations]
        });
      }
    });
  }, [subscribeToMore]);

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      flexShrink={0}
      bg="whiteAlpha.50"
      py="6"
      px="3"
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}>
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};

export default ConversationsWrapper;
