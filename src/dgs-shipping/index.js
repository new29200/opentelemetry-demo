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
    shippingServiceAddr: process.env.SHIPPING_SERVICE_ADDR || 'shipping:50050',
  }),
});

server.listen({ port: process.env.PORT || 4008 }, () => {
  console.log('DGS Shipping listening on port', process.env.PORT || 4008);
});
