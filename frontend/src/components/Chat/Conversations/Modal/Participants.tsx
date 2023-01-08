import { IoIosCloseCircleOutline } from 'react-icons/io';

import { Flex, Stack, Text } from '@chakra-ui/react';

import { SearchedUser } from '../../../../domain/SearchUsers';

interface ParticipantsProps {
  participants: SearchedUser[];
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
  return (
    <Flex gap="10px" wrap="wrap">
      {participants.map(participant => (
        <Stack key={participant.id} direction="row" align="center" bg="whiteAlpha.200" borderRadius={4} padding={2}>
          <Text>{participant.username}</Text>
          <IoIosCloseCircleOutline size={20} cursor="pointer" onClick={() => removeParticipant(participant.id)} />
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
