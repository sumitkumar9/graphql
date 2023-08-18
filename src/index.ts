import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

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
    `,
    resolvers: {
        Query: {
            hello: () => "hello sumit",
            say: (_, {name}: { name: string }) => `Hey ${name}`
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
