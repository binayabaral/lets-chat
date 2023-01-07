import { useState } from 'react';
import { Session } from 'next-auth';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useMutation } from '@apollo/client';

import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';

import userOperations from '../../graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from '../../domain/CreateUsername';

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);
  const [createUsername, { loading }] = useMutation<CreateUsernameData, CreateUsernameVariables>(
    userOperations.Mutations.createUsername
  );

  const onSubmit = async () => {
    if (!username) {
      return;
    }

    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      const { error } = data.createUsername;

      if (error) {
        throw new Error(error);
      }

      toast.success('Username successfully created');
      setSuccess(true);
      // reload session to get new username
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div>
      <Center height="100vh">
        <Stack align="center" spacing={3}>
          {session ? (
            <>
              <Text fontSize="3xl">Create a username</Text>
              <Input placeholder="Enter a username" value={username} onChange={e => setUsername(e.target.value)} />
              <Button onClick={onSubmit} width="100%" isLoading={loading || success} loadingText="Processing">
                Save
              </Button>
            </>
          ) : (
            <>
              <Text fontSize="3xl">Let&apos;s Chat</Text>
              <Button
                onClick={() => signIn('google')}
                leftIcon={<Image height="20px" src="/images/google.png" alt="Google" />}>
                Continue with Google
              </Button>
            </>
          )}
        </Stack>
      </Center>
    </div>
  );
};

export default Auth;
