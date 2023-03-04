import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import { MESSAGE_SENT } from '../../constants/message';
import GraphQLContext from '../../domain/GraphQLContext';
import { userIsConversationParticipant } from '../../util/common';
import { CONVERSATION_UPDATED } from '../../constants/conversation';
import SendMessageArguments from '../../domain/SendMessageArguments';
import MessageSent from '../../domain/subscriptionPayload/MessageSent';
import populatedMessage from '../../prisma/validator/populatedMessage';
import { PopulatedMessage } from '../../domain/prismaPopulated/Message';
import populatedConversation from '../../prisma/validator/populatedConversation';

const resolvers = {
  Query: {
    messages: async function (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<PopulatedMessage>> {
      const { session, prisma } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized');
      }

      const {
        user: { id: userId }
      } = session;

      // Verify that conversation exists and the user is participant.
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId
        },
        include: populatedConversation
      });

      if (!conversation) {
        throw new GraphQLError('Conversation not found');
      }

      const isUserAuthorized = userIsConversationParticipant(conversation.participants, userId);

      if (!isUserAuthorized) {
        throw new GraphQLError('Not Authorized');
      }

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId
          },
          include: populatedMessage,
          orderBy: {
            createdAt: 'desc'
          }
        });

        return messages;
      } catch (error: any) {
        console.log('Error querying for messages');
        throw new GraphQLError('Error querying for messages', error?.message);
      }
    }
  },
  Mutation: {
    sendMessage: async function (_: any, args: SendMessageArguments, context: GraphQLContext): Promise<boolean> {
      const { prisma, pubSub, session } = context;
      const { id: messageId, senderId, conversationId, body } = args;

      if (!session?.user || session.user.id !== senderId) {
        throw new GraphQLError('Not Authorized');
      }

      const {
        user: { id: userId }
      } = session;

      try {
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body
          },
          include: populatedMessage
        });

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId
          }
        });

        if (!participant) {
          throw new GraphQLError('Participant does not exist');
        }

        const { id: participantId } = participant;

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participantId
                },
                data: {
                  hasSeenLatestMessage: true
                }
              },
              updateMany: {
                where: {
                  conversationId,
                  NOT: {
                    userId
                  }
                },
                data: {
                  hasSeenLatestMessage: false
                }
              }
            }
          },
          include: populatedConversation
        });

        pubSub.publish(MESSAGE_SENT, { messageSent: newMessage });
        pubSub.publish(CONVERSATION_UPDATED, { conversationUpdated: { conversation } });
        return true;
      } catch (error: any) {
        console.log(error);
        throw new GraphQLError('Error sending message', error?.message);
      }
    }
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;
          return pubSub.asyncIterator([MESSAGE_SENT]);
        },
        (payload: MessageSent, args: { conversationId: string }, context: GraphQLContext) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      )
    }
  }
};

export default resolvers;
