import { toast } from 'react-hot-toast';
import { useQuery } from '@apollo/client';

import { Flex, Stack } from '@chakra-ui/react';

import MessagesOperations from '../../../../graphql/operations/message';
import { MessagesData, MessagesVariables } from '../../../../domain/Messages';

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(
    MessagesOperations.Queries.messages,
    {
      variables: { conversationId },
      onError: ({ message }) => {
        toast.error(message);
      }
    }
  );

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack>
          <div>Loading</div>
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map(message => (
            // <MessageItem/>
            <div key={message.id}>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
