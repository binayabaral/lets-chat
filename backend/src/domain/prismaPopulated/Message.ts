import { Prisma } from '@prisma/client';

import populatedMessage from '../../prisma/validator/populatedMessage';

export type PopulatedMessage = Prisma.MessageGetPayload<{ include: typeof populatedMessage }>;
