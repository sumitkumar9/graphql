import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from './lib/db';

async function startServer() {
  const app = express();
  const PORT = 8080;
  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
        type Mutation {
            createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
        }
    `,
    resolvers: {
        Query: {
            hello: () => "hello sumit",
            say: (_, {name}: { name: string }) => `Hey ${name}`
        },
        Mutation: {
            createUser: async (_, {firstName,lastName,email,password}: {firstName: string,lastName: string,email: string,password: string}) => {
                try {
                    await prismaClient.user.create({ data: {
                        firstName,
                        lastName,
                        email,
                        password,
                        salt: "random_salt"
                    }});
                    return true;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
  });

  await gqlServer.start();
  app.use("/graphql", expressMiddleware(gqlServer))

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}

startServer();
