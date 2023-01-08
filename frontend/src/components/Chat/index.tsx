import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Button, Flex } from '@chakra-ui/react';

import FeedWrapper from './Feed/FeedWrapper';
import ConversationsWrapper from './Conversations/ConversationsWrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
      <Button onClick={() => signOut()}>Log Out</Button>
    </Flex>
  );
};

export default Chat;
