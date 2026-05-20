// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:${process.env.NEXT_PUBLIC_GRAPHQL_PORT}/graphql`, 
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});