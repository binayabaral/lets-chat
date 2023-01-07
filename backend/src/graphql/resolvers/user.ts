import GraphQLContext from '../../domain/GraphQLContext';
import CreateUsernameResponse from '../../domain/Response/CreateUsernameResponse';

const resolvers = {
  Query: {
    searchUsers: () => {}
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
