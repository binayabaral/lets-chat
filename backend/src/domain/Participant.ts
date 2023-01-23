import { Prisma } from '@prisma/client';

import populatedParticipant from '../prisma/validator/populatedParticipant';

export type PopulatedParticipant = Prisma.ConversationParticipantGetPayload<{ include: typeof populatedParticipant }>;
