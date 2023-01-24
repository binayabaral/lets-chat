import { Prisma } from '@prisma/client';

const populatedMessage = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true
    }
  }
});

export default populatedMessage;
