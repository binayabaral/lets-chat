import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import GraphQLContext from '../../domain/GraphQLContext';
import { CONVERSATION_CREATED } from '../../constants/conversation';
import populatedConversation from '../../prisma/validator/populatedConversation';
import { PopulatedConversation } from '../../domain/prismaPopulated/Conversation';
import ConversationCreated from '../../domain/subscriptionPayload/ConversationCreated';

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
    },
    markConversationAsRead: async (
      _: any,
      args: { userId: string; conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma } = context;

      const { userId, conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized');
      }

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId
          }
        });

        if (!participant) {
          throw new GraphQLError('Participant entity not found');
        }

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id
          },
          data: {
            hasSeenLatestMessage: true
          }
        });
        return true;
      } catch (error: any) {
        console.log('markConversationAsRead', error);
        throw new GraphQLError(error?.message);
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
        (payload: ConversationCreated, _, context: GraphQLContext) => {
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
