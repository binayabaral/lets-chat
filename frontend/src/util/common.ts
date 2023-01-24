import { PopulatedParticipant } from '../../../backend/src/domain/prismaPopulated/Participant';

export const formatUsernames = (participants: Array<PopulatedParticipant>, loggedInUserId: string) => {
  const usernames = participants
    .filter(participant => participant.user.id !== loggedInUserId)
    .map(participant => participant.user.username);

  return usernames.join(', ');
};
