import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import schemas from "./schemas";
import resolvers from "./resolvers";
import logger from "./config/logger";
import db from "./config/database";
import envs from "./config/env";
import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { authenticateUser } from "./utils/helpers/auth.helpers";

const PORT: number = parseInt(envs.PORT) || 4000;

const startServer = async () => {
  db.connect()
    .then(async () => {
      const app = express();
      app.use(cors());
      const httpServer = http.createServer(app);
      const server = new ApolloServer({
        typeDefs: schemas,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });
      await server.start();

      app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server, {
          context: async ({ req }) => {
            // get the user token from the headers
            const token = req.headers.authorization || "";
            const user = authenticateUser(token);

            // add the user to the context
            return { user };
          },
        })
      );

      await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
      );
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
    })
    .catch((error) => {
      logger.error(error.message);
      process.exit(1);
    });
};

startServer();
