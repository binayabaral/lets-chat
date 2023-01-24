import { Prisma } from '@prisma/client';

import populatedConversation from '../../prisma/validator/populatedConversation';

export type PopulatedConversation = Prisma.ConversationGetPayload<{ include: typeof populatedConversation }>;
