import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import GraphQLContext from '../../domain/GraphQLContext';
import { PopulatedConversation } from '../../domain/Conversation';
import { CONVERSATION_CREATED } from '../../constants/conversation';
import populatedConversation from '../../prisma/validator/populatedConversation';
import ConversationCreatedSubscriptionPayload from '../../domain/ConversationCreatedSubscriptionPayload';

const resolvers = {
  Query: {
    conversations: async (_: any, __: any, context: GraphQLContext): Promise<Array<PopulatedConversation>> => {
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized');
      }

      const {
        user: { id: userId }
      } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId
                }
              }
            }
          },
          include: populatedConversation
        });

        // Due to known issue in prisma adapter for mongo db
        return conversations.filter(conversation => !!conversation.participants.find(p => p.userId === userId));
      } catch (error) {
        console.log('Conversations error', error);
        throw new GraphQLError('Error creating conversation');
      }
    }
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[] },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { participantIds } = args;
      const { session, prisma, pubSub } = context;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized');
      }

      const { id: userId } = session.user;
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map(participantId => ({
                  userId: participantId,
                  hasSeenLatestMessage: participantId === userId
                }))
              }
            }
          },
          include: populatedConversation
        });

        pubSub.publish(CONVERSATION_CREATED, {
          conversationCreated: conversation
        });

        return {
          conversationId: conversation.id
        };
      } catch (error) {
        console.log('Create conversation error', error);
        throw new GraphQLError('Error creating conversation');
      }
    }
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;
          return pubSub.asyncIterator([CONVERSATION_CREATED]);
        },
        (payload: ConversationCreatedSubscriptionPayload, _, context: GraphQLContext) => {
          const { session } = context;
          const {
            conversationCreated: { participants }
          } = payload;

          const userIsParticipant = !!participants.find(participant => participant.userId === session?.user.id);
          return userIsParticipant;
        }
      )
    }
  }
};

export default resolvers;
