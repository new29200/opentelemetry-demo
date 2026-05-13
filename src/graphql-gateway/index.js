// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const { ApolloServer } = require('apollo-server');
const gateway = require('./gateway');

const server = new ApolloServer({
  gateway,
  context: () => ({}),
});

server.listen({ port: process.env.PORT || 4000 }, () => {
  console.log('GraphQL Gateway listening on port', process.env.PORT || 4000);
});
