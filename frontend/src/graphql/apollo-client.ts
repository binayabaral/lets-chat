import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';

const httpLink = new HttpLink({
  uri: `http://${process.env.BASE_URL}/graphql`,
  credentials: 'include'
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: `ws://${process.env.BASE_URL}/graphql/subscriptions`,
          connectionParams: async () => ({
            session: await getSession()
          })
        })
      )
    : null;

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink
    )
  : httpLink;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
