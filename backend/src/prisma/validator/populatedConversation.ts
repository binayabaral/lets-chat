import { Prisma } from '@prisma/client';

import populatedParticipant from './populatedParticipant';

const populatedConversation = Prisma.validator<Prisma.ConversationInclude>()({
  participants: {
    include: populatedParticipant
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true
        }
      }
    }
  }
});

export default populatedConversation;
