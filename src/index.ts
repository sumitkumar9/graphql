import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQlServer from "./graphql"

async function startServer() {
  const app = express();
  const PORT = 8080;
  app.use(express.json());


  const gqlServer = await createGraphQlServer();
  app.use("/graphql", expressMiddleware(gqlServer))

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}

startServer();
