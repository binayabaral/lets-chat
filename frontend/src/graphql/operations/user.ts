import { gql } from '@apollo/client';

const Queries = {
  searchUsers: gql`
    query SearchUsers($username: String!) {
      searchUsers(username: $username) {
        id
        name
        image
        username
      }
    }
  `
};

const Mutations = {
  createUsername: gql`
    mutation CreateUsername($username: String!) {
      createUsername(username: $username) {
        success
        error
      }
    }
  `
};

const Subscriptions = {};

const userOperations = {
  Queries,
  Mutations,
  Subscriptions
};

export default userOperations;
