import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';

import { SearchedUser } from '../../../../domain/SearchUsers';

interface UserSearchListProps {
  users: SearchedUser[];
  selectedParticipantIds: string[];
  addParticipant: (user: SearchedUser) => void;
  removeParticipant: (userId: string) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users, addParticipant, selectedParticipantIds }) => {
  return (
    <>
      {users.length ? (
        <Stack mt={6}>
          {users.map(user => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              _hover={{ bg: 'whiteAlpha.200' }}>
              <Avatar name={user.name} src={user.image} />
              <Flex justify="space-between" align="center" width="100%">
                <Flex direction="column">
                  <Text textTransform="capitalize">{user.name}</Text>
                  <Text fontSize="xs">@{user.username}</Text>
                </Flex>
                <Button
                  bg="brand.100"
                  _hover={{ bg: 'brand.200' }}
                  onClick={() => addParticipant(user)}
                  disabled={selectedParticipantIds.includes(user.id)}>
                  Add
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      )}
    </>
  );
};

export default UserSearchList;
