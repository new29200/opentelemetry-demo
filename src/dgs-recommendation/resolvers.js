// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let recommendationClient;

const initGrpcClient = (recommendationServiceAddr) => {
  if (recommendationClient) return;

  const packageDefinition = protoLoader.loadSync('../../../pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const RecommendationService = proto.oteldemo.RecommendationService;
  recommendationClient = new RecommendationService(recommendationServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    listRecommendations: async (_, { userId, productIds }, context) => {
      initGrpcClient(context.recommendationServiceAddr);

      return new Promise((resolve, reject) => {
        recommendationClient.listRecommendations({ user_id: userId, product_ids: productIds }, (err, response) => {
          if (err) reject(err);
          else resolve(response.product_ids);
        });
      });
    },
  },
};

module.exports = resolvers;
