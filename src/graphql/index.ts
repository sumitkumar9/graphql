import { ApolloServer } from "@apollo/server";

async function createGraphQlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
            type Query {
                
            }
            type Mutation {
                
            }
        `,
    resolvers: {
      Query: {},
      Mutation: {},
    },
  });

  await gqlServer.start();
  return gqlServer;
}
export default createGraphQlServer;
