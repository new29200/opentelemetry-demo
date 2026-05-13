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
    recommendationServiceAddr: process.env.RECOMMENDATION_SERVICE_ADDR || 'recommendation:9001',
  }),
});

server.listen({ port: process.env.PORT || 4007 }, () => {
  console.log('DGS Recommendation listening on port', process.env.PORT || 4007);
});
