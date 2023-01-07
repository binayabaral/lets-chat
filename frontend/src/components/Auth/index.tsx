import { useState } from 'react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';

import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState('');

  const onSubmit = async () => {
    try {
      // create a mutation to send our username to the graphql mutation
    } catch (error) {
      console.log('onsubmit error', error);
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
              <Button onClick={onSubmit} width="100%">
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
