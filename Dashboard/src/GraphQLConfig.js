import React from "./node_modules/react";
import ApolloClient from "./node_modules/apollo-boost";
import { ApolloProvider } from "./node_modules/react-apollo";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8080/graphql"
});

export default function Root() {
  return <ApolloProvider client={client}></ApolloProvider>;
}
