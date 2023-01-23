import { Context } from 'graphql-ws/lib/server';

import { Session } from './GraphQLContext';

interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export default SubscriptionContext;
