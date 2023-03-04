import React, { useState } from 'react';
import enUS from 'date-fns/locale/en-US';
import { formatRelative } from 'date-fns';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { BiLogOut, BiUser } from 'react-icons/bi';

import { Avatar, Box, Button, Flex, Menu, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';

import { formatUsernames } from '../../../util/common';
import { PopulatedConversation } from '../../../../../backend/src/domain/prismaPopulated/Conversation';

const formatRelativeLocale = {
  lastWeek: 'eeee',
  yesterday: "'Yesterday",
  today: 'p',
  other: 'MM/dd/yy'
};

interface ConversationItemProps {
  userId: string;
  conversation: PopulatedConversation;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean | undefined;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
  hasSeenLatestMessage
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === 'click') {
      onClick();
    } else if (event.type === 'contextmenu') {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  return (
    <Button
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      p={2}
      height="auto"
      cursor="pointer"
      borderRadius={4}
      bg={isSelected ? 'whiteAlpha.200' : 'none'}
      _hover={{ bg: 'whiteAlpha.200' }}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative">
      <Flex position="absolute" right={0} top={0}>
        {hasSeenLatestMessage === false && <GoPrimitiveDot fontSize={18} color="#6B46C1" />}
      </Flex>
      <Avatar icon={<BiUser />} bg="brand.200" />
      <Flex justify="space-between" align="center" width="calc(100% - 55px)" height="100%">
        <Flex width="calc(100% - 55px)" height="100%" direction="column" alignItems="flex-start">
          <Text fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Text
              color="whiteAlpha.700"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize="xs"
              pt={1}
              maxWidth="100%">
              {conversation.latestMessage.body}
            </Text>
          )}
        </Flex>
        <Text color="whiteAlpha.700" textAlign="right" position="absolute" right={4} fontSize="x-small">
          {formatRelative(new Date(conversation.updatedAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: token => formatRelativeLocale[token as keyof typeof formatRelativeLocale]
            }
          })}
        </Text>
      </Flex>
    </Button>
  );
};
export default ConversationItem;
