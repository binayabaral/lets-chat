import { User } from '@prisma/client';
import { GraphQLError } from 'graphql';

import GraphQLContext from '../../domain/GraphQLContext';
import CreateUsernameResponse from '../../domain/response/CreateUsernameResponse';

const resolvers = {
  Query: {
    searchUsers: async (_: any, args: { username: string }, context: GraphQLContext): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized', {
          extensions: {
            code: 'NOT_AUTHORIZED'
          }
        });
      }

      const {
        user: { username: loggedInUsername }
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: loggedInUsername,
              mode: 'insensitive'
            }
          }
        });
        return users;
      } catch (error: any) {
        throw new GraphQLError(error?.message);
      }
    }
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        return {
          error: 'Not Authorized'
        };
      }

      const { id: userId } = session.user;

      try {
        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
          where: { username }
        });

        if (existingUser) {
          return {
            error: 'Username already taken. Try another'
          };
        }

        // Update user
        await prisma.user.update({
          where: { id: userId },
          data: { username }
        });

        return { success: true };
      } catch (error: any) {
        console.log('Create Username error');
        return {
          error: error?.message
        };
      }
    }
  }
};

export default resolvers;
