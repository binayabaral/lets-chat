const typeDefs = `#graphql
  type searchedUser {
    id: String
    name: String
    image: String
    username: String
  }

  type Query {
    searchUsers(username: String): [searchedUser]
  }

  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
