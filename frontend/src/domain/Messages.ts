import { PopulatedMessage } from '../../../backend/src/domain/prismaPopulated/Message';

export interface MessagesData {
  messages: Array<PopulatedMessage>;
}

export interface MessagesVariables {
  conversationId: string;
}
