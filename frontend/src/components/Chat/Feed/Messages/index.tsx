import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@apollo/client';

import { Flex, Stack } from '@chakra-ui/react';

import MessageItem from './Item';
import SkeletonLoader from '../../../common/SkeletonLoader';
import messageOperations from '../../../../graphql/operations/message';
import { MessagesData, MessagesVariables } from '../../../../domain/Messages';
import { PopulatedMessage } from '../../../../../../backend/src/domain/prismaPopulated/Message';

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(
    messageOperations.Queries.messages,
    {
      variables: { conversationId },
      onError: ({ message }) => {
        toast.error(message);
      }
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: messageOperations.Subscriptions.messageSent,
      variables: {
        conversationId
      },
      updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { messageSent: PopulatedMessage } } }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: newMessage.sender.id === userId ? prev.messages : [newMessage, ...prev.messages]
        });
      }
    });
  }, [subscribeToMore, conversationId, userId]);

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map(message => (
            <MessageItem key={message.id} message={message} sentByMe={message.sender.id === userId} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
