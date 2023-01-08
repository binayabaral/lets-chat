import Head from 'next/head';
import type { NextPage, NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

import { Box } from '@chakra-ui/react';

import Auth from '../components/Auth';
import Chat from '../components/Chat';

const Home: NextPage = () => {
  const { data: session } = useSession();

  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <>
      <Head>
        <title>Let&apos;s Chat</title>
      </Head>
      <Box>
        {session?.user?.username ? (
          <Chat session={session} />
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </Box>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}

export default Home;
