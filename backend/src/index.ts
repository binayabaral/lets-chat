import cors from 'cors';
import express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { getSession } from 'next-auth/react';
import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { config as configureDotenv } from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import SubscriptionContext from './domain/SubscriptionContext';
import GraphQLContext, { Session } from './domain/GraphQLContext';

const main = async () => {
  configureDotenv();
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const prisma = new PrismaClient();
  const pubSub = new PubSub();

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions'
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams?.session) {
          const { session } = ctx.connectionParams;
          return { session, prisma, pubSub };
        }

        return { prisma, pubSub, session: null };
      }
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ]
  });

  await server.start();

  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true
  };

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req });

        return { session: session as Session, prisma, pubSub };
      }
    })
  );

  await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));

  console.log(`Server is now running on http://localhost:${process.env.PORT || 4000}/graphql`);
};

main().catch(err => console.log(err));
