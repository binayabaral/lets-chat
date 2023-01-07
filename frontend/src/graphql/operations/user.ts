import { gql } from '@apollo/client';

const Queries = {};

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
