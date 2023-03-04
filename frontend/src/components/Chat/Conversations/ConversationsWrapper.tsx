import { useEffect } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';

import { Box } from '@chakra-ui/react';

import ConversationList from './ConversationList';
import SkeletonLoader from '../../common/SkeletonLoader';
import { ConversationsData } from '../../../domain/Conversation';
import { UpdatedConversationData } from '../../../domain/UpdateConversation';
import conversationOperations from '../../../graphql/operations/conversation';
import { PopulatedParticipant } from '../../../../../backend/src/domain/prismaPopulated/Participant';
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

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(conversationOperations.Mutations.markConversationAsRead);

  useSubscription<UpdatedConversationData, null>(conversationOperations.Subscriptions.conversationUpdated, {
    onData: ({ client, data }) => {
      const { data: subscriptionData } = data;

      if (!subscriptionData) return;

      console.log({ subscriptionData });

      const {
        conversationUpdated: { conversation: latestConversation }
      } = subscriptionData;

      const currentlyViewingConversation = latestConversation.id === conversationId;

      if (currentlyViewingConversation) {
        onViewConversation(conversationId, false);
      }
    }
  });

  const router = useRouter();
  const {
    query: { conversationId }
  } = router;
  const {
    user: { id: userId }
  } = session;

  const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean) => {
    router.push({ query: { conversationId } });

    if (hasSeenLatestMessage) {
      return;
    }

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId
        },
        optimisticResponse: {
          markConversationAsRead: true
        },
        update: cache => {
          const participantsFragment = cache.readFragment<{ participants: Array<PopulatedParticipant> }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIndex = participants.findIndex(participant => participant.user.id === userId);

          // Return if doesn't exist
          if (userParticipantIndex === -1) return;

          const userParticipant = participants[userParticipantIndex];

          participants[userParticipantIndex] = {
            ...userParticipant,
            hasSeenLatestMessage: true
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants
            }
          });
        }
      });
    } catch (error) {
      console.log('onViewConversationError', error);
    }
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
      {conversationsLoading ? (
        <Box width="100%">
          <Box pb={5}>
            <SkeletonLoader count={1} height="40px" width="100%" />
          </Box>
          <SkeletonLoader count={5} height="64px" width="100%" />
        </Box>
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationsWrapper;
