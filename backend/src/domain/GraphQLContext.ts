import { ISODateString } from 'next-auth';
import { PrismaClient } from '@prisma/client';

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    emailVerified: boolean;
  };
  expires: ISODateString;
}

interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export default GraphQLContext;
