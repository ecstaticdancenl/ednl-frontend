import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://ednl.test/ednl-backend/graphql",
  // uri: "https://ecstaticdance.nl/wp/graphql",
  cache: new InMemoryCache(),
});

export default client;
