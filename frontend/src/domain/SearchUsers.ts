export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: [SearchedUser];
}

export interface SearchedUser {
  id: string;
  name: string;
  image: string;
  username: string;
}
