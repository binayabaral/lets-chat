import GraphQLContext from '../../domain/GraphQLContext';

const resolvers = {
  Mutation: {
    createConversation: async (_: any, args: { participantIds: string[] }, context: GraphQLContext) => {
      console.log('inside create', args);
    }
  }
};

export default resolvers;
