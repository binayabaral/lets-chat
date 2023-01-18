import { useState } from 'react';
import { Session } from 'next-auth';

import { Box, Button, Text } from '@chakra-ui/react';

import ConversationModel from './Modal';
import ConversationItem from './ConversationItem';
import { PopulatedConversation } from '../../../../../backend/src/domain/Conversation';

interface ConversationListProps {
  session: Session;
  conversations: Array<PopulatedConversation>;
}

const ConversationList: React.FC<ConversationListProps> = ({ session, conversations }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);

  return (
    <Box width="100%">
      <Button py={2} px={4} mb={4} width="100%" bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Button>
      <ConversationModel isOpen={isOpen} onClose={onClose} session={session} />
      {conversations.map(conversation => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </Box>
  );
};

export default ConversationList;
