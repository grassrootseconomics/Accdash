import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8080/graphql"
});

export default function Root() {
  return <ApolloProvider client={client}></ApolloProvider>;
}
