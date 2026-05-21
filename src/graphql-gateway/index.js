// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const { ApolloServer } = require('apollo-server');
const gateway = require('./gateway');

const server = new ApolloServer({
  gateway,
  context: () => ({}),
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://frontend:8080', 'http://frontend-proxy:8080',],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'traceparent', 'baggage'],
  },
});

server.listen({ port: process.env.PORT || 4000 }, () => {
  console.log('GraphQL Gateway listening on port', process.env.PORT || 4000);
});