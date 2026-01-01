import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground available at: ${url}graphql`);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
