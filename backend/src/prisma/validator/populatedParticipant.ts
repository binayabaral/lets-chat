import { Prisma } from '@prisma/client';

const populatedParticipant = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true
    }
  }
});

export default populatedParticipant;
