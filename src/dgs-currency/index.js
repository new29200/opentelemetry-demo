// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const { ApolloServer } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');

const typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  context: () => ({
    currencyServiceAddr: process.env.CURRENCY_SERVICE_ADDR || 'currency:7001',
  }),
});

server.listen({ port: process.env.PORT || 4003 }, () => {
  console.log('DGS Currency listening on port', process.env.PORT || 4003);
});
