import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

type ChatProps = {};

const Chat: React.FC<ChatProps> = props => {
  return (
    <div>
      Chat
      <Button onClick={() => signOut()}>Log Out</Button>
    </div>
  );
};

export default Chat;
