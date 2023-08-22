import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQlServer from "./graphql"
import { UserService } from "./services/user";

async function startServer() {
  const app = express();
  const PORT = 8080;
  app.use(express.json());


  const gqlServer = await createGraphQlServer();
  app.use("/graphql", expressMiddleware(gqlServer, { context: async ({req}) => {
    try {
      const token = req.headers["token"];
      const user = UserService.decodeToken(token as string);
      return {user};
    } catch (error) {
      return {}
    }
  }}))

  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}

startServer();
