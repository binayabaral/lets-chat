import { useRouter } from 'next/router';

import { Button, Stack, Text } from '@chakra-ui/react';

import { PopulatedConversation } from '../../../../../backend/src/domain/Conversation';

interface ConversationItemProps {
  conversation: PopulatedConversation;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
  const router = useRouter();
  const { id: conversationId } = conversation;

  const setConversationId = () => {
    router.push({ query: { conversationId } });
  };
  return (
    <Stack>
      <Button
        py={2}
        px={4}
        mb={1}
        width="100%"
        bg="blackAlpha.100"
        borderRadius={4}
        cursor="pointer"
        onClick={setConversationId}>
        <Text>{conversation.id}</Text>
      </Button>
    </Stack>
  );
};

export default ConversationItem;
