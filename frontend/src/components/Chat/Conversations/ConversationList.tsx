import { useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import { Box, Button, Text } from '@chakra-ui/react';

import ConversationModel from './Modal';
import ConversationItem from './ConversationItem';
import { PopulatedConversation } from '../../../../../backend/src/domain/Conversation';

interface ConversationListProps {
  session: Session;
  onViewConversation: (conversationId: string) => void;
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

  return (
    <Box width="100%">
      <Button py={2} px={4} mb={4} width="100%" bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Button>
      <ConversationModel isOpen={isOpen} onClose={onClose} session={session} />
      {conversations.map(conversation => (
        <ConversationItem
          userId={userId}
          key={conversation.id}
          conversation={conversation}
          onClick={() => onViewConversation(conversation.id)}
          isSelected={conversation.id === router.query.conversationId}
        />
      ))}
    </Box>
  );
};

export default ConversationList;
