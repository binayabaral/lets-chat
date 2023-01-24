import { PopulatedParticipant } from '../domain/prismaPopulated/Participant';

export const userIsConversationParticipant = (participants: Array<PopulatedParticipant>, userId: string): boolean => {
  return !!participants.find(participant => participant.userId === userId);
};
