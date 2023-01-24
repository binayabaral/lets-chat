import merge from 'lodash.merge';

import userResolvers from './user';
import messageResolvers from './message';
import conversationResolvers from './conversation';

const resolvers = merge({}, userResolvers, conversationResolvers, messageResolvers);

export default resolvers;
