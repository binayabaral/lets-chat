import { useState } from 'react';
import { Session } from 'next-auth';

import { Box, Button, Text } from '@chakra-ui/react';

import ConversationModel from './Modal';

interface ConversationListProps {
  session: Session;
}

const ConversationList: React.FC<ConversationListProps> = ({ session }) => {
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
    </Box>
  );
};

export default ConversationList;
