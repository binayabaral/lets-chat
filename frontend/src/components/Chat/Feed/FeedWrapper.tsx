import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import MessagesHeader from './Messages/MessagesHeader';

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
        <Flex direction="column" justify="space-between" overflow="hidden" flexGrow={1}>
          <MessagesHeader userId={userId} conversationId={conversationId as string} />
        </Flex>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
