import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import Messages from './Messages';
import MessageInput from './Messages/Input';
import MessageHeader from './Messages/Header';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const {
    user: { id: userId }
  } = session;
  const router = useRouter();
  const {
    query: { conversationId }
  } = router;

  return (
    <Flex display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }} width="100%" direction="column">
      {conversationId ? (
        <>
          <Flex direction="column" justify="space-between" overflow="hidden" flexGrow={1}>
            <MessageHeader userId={userId} conversationId={conversationId as string} />
            <Messages userId={userId} conversationId={conversationId as string} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId as string} />
        </>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
