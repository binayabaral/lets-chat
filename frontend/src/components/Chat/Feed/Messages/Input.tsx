import { Session } from 'next-auth';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Box, Input } from '@chakra-ui/react';

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ session, conversationId }) => {
  const [messageBody, setMessageBody] = useState('');

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // send message mutation here
    } catch (error: any) {
      console.log('Send message error');
      toast.error(error?.message);
    }
  };
  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => {}}>
        <Input
          value={messageBody}
          onChange={e => setMessageBody(e.target.value)}
          placeholder="New Message"
          resize="none"
        />
      </form>
    </Box>
  );
};

export default MessageInput;
