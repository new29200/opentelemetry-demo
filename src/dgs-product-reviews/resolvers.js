// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let productReviewClient;

const initGrpcClient = (productReviewServiceAddr) => {
  if (productReviewClient) return;

  const packageDefinition = protoLoader.loadSync('../../../pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const ProductReviewService = proto.oteldemo.ProductReviewService;
  productReviewClient = new ProductReviewService(productReviewServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    getProductReviews: async (_, { productId }, context) => {
      initGrpcClient(context.productReviewServiceAddr);

      return new Promise((resolve, reject) => {
        productReviewClient.getProductReviews({ product_id: productId }, (err, response) => {
          if (err) reject(err);
          else resolve(response.product_reviews);
        });
      });
    },
    getAverageProductReviewScore: async (_, { productId }, context) => {
      initGrpcClient(context.productReviewServiceAddr);

      return new Promise((resolve, reject) => {
        productReviewClient.getAverageProductReviewScore({ product_id: productId }, (err, response) => {
          if (err) reject(err);
          else resolve(response.average_score);
        });
      });
    },
    askProductAIAssistant: async (_, { productId, question }, context) => {
      initGrpcClient(context.productReviewServiceAddr);

      return new Promise((resolve, reject) => {
        productReviewClient.askProductAIAssistant({ product_id: productId, question }, (err, response) => {
          if (err) reject(err);
          else resolve(response.response);
        });
      });
    },
  },
};

module.exports = resolvers;
