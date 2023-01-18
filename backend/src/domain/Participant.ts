import { Prisma } from '@prisma/client';

import populatedParticipant from '../prisma/validator/populatedParticipant';

export type populatedParticipant = Prisma.ConversationParticipantGetPayload<{ include: typeof populatedParticipant }>;
