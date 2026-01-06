import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: '/graphql', // Use Vite proxy instead of direct connection
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          trainingSessions: {
            merge(existing, incoming) {
              // Always replace with incoming data (since we use network-only)
              return incoming;
            },
          },
          players: {
            merge(existing, incoming) {
              // Always replace with incoming data (since we use network-only)
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});
