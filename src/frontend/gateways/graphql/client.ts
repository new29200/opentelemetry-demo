// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',  
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});