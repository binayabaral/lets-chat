import { ObjectID } from 'bson';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@apollo/client';

import { Box, Input } from '@chakra-ui/react';

import { MessagesData } from '../../../../domain/Messages';
import messageOperations from '../../../../graphql/operations/message';
import SendMessageArguments from '../../../../../../backend/src/domain/SendMessageArguments';

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ session, conversationId }) => {
  const [messageBody, setMessageBody] = useState('');
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArguments>(
    messageOperations.Mutations.sendMessage
  );

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageBody) {
      return;
    }

    try {
      const {
        user: { id: senderId, username }
      } = session;
      const messageId = new ObjectID().toString();
      const newMessage: SendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody
      };
      setMessageBody('');
      const { data, errors } = await sendMessage({
        variables: newMessage,
        optimisticResponse: {
          sendMessage: true
        },
        update: cache => {
          setMessageBody('');
          const existing = cache.readQuery<MessagesData>({
            query: messageOperations.Queries.messages,
            variables: { conversationId }
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: messageOperations.Queries.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    username: username || '',
                    id: session.user.id
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now())
                },
                ...existing.messages
              ]
            }
          });
        }
      });

      if (!data?.sendMessage || errors) {
        throw new Error('Failed to send message');
      }
    } catch (error: any) {
      console.log('Send message error');
      toast.error(error?.message);
    }
  };
  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
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
