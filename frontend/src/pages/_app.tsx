import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';

import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../chakra/theme';
import { client } from '../graphql/apollo-client';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <Toaster />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
