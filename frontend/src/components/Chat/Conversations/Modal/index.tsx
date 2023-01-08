import { Session } from 'next-auth';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  Box,
  Text,
  Input,
  Modal,
  Stack,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton
} from '@chakra-ui/react';

import Participants from './Participants';
import UserSearchList from './UserSearchList';
import userOperations from '../../../../graphql/operations/user';
import conversationOperations from '../../../../graphql/operations/conversation';
import { SearchedUser, SearchUsersData, SearchUsersInput } from '../../../../domain/SearchUsers';
import { CreateConversationData, CreateConversationInput } from '../../../../domain/CreateConversation';

interface ModalProps {
  isOpen: boolean;
  session: Session;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose, session }) => {
  const {
    user: { id: userId }
  } = session;
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<SearchedUser[]>([]);

  const [searchUsers, { data, error, loading }] = useLazyQuery<SearchUsersData, SearchUsersInput>(
    userOperations.Queries.searchUsers
  );
  const [createConversation, { loading: createConversationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationInput
  >(conversationOperations.Mutations.createConversation);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants(prev => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants(prev => prev.filter(participant => participant.id !== userId));
  };

  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map(participant => participant.id)];

    try {
      createConversation({ variables: { participantIds } });
    } catch (error: any) {
      console.log('On Create conversation error', error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input placeholder="Enter a username" value={username} onChange={e => setUsername(e.target.value)} />
                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
                removeParticipant={removeParticipant}
                selectedParticipantIds={participants.map(participant => participant.id)}
              />
            )}
            {!!participants.length && (
              <Box pt={8}>
                <Text mb={2} textDecoration="underline">
                  Selected Participants:
                </Text>
                <Participants participants={participants} removeParticipant={removeParticipant} />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: 'brand.200' }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}>
                  Create Conversation
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
