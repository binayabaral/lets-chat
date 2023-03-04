import { useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import { Box, Button, Text } from '@chakra-ui/react';

import ConversationModel from './Modal';
import ConversationItem from './ConversationItem';
import { PopulatedConversation } from '../../../../../backend/src/domain/prismaPopulated/Conversation';

interface ConversationListProps {
  session: Session;
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void;
  conversations: Array<PopulatedConversation>;
}

const ConversationList: React.FC<ConversationListProps> = ({ session, conversations, onViewConversation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const router = useRouter();
  const {
    user: { id: userId }
  } = session;

  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(`${a.updatedAt}`);
    const dateB = new Date(`${b.updatedAt}`);

    return dateB.valueOf() - dateA.valueOf();
  });

  console.log({ conversations, sortedConversations });

  return (
    <Box width="100%">
      <Button py={2} px={4} mb={4} width="100%" bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Button>
      <ConversationModel isOpen={isOpen} onClose={onClose} session={session} />
      {sortedConversations.map(conversation => {
        const hasSeenLatestMessage = !!conversation.participants.find(participant => participant.user.id === userId)
          ?.hasSeenLatestMessage;

        return (
          <ConversationItem
            userId={userId}
            key={conversation.id}
            hasSeenLatestMessage={hasSeenLatestMessage}
            conversation={conversation}
            onClick={() => onViewConversation(conversation.id, hasSeenLatestMessage)}
            isSelected={conversation.id === router.query.conversationId}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
