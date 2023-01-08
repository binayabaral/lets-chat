import cors from 'cors';
import express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { getSession } from 'next-auth/react';
import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { config as configureDotenv } from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
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

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
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

        return { session: session as Session, prisma };
      }
    })
  );

  await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));

  console.log(`Server is now running on http://localhost:${process.env.PORT || 4000}/graphql`);
};

main().catch(err => console.log(err));
