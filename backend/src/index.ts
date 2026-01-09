import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import dotenv from 'dotenv';
import { ImageResolver } from './resolvers/ImageResolver';

dotenv.config();

async function bootstrap() {
  const app = express();
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  const schema = await buildSchema({
    resolvers: [ImageResolver],
    authChecker: () => true, // simple auth
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ user: true }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('🚀 Server: http://localhost:4000/graphql');
  });
}

bootstrap();
