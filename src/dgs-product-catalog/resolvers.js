// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let productCatalogClient;

const initGrpcClient = (productCatalogServiceAddr) => {
  if (productCatalogClient) return;

  const packageDefinition = protoLoader.loadSync('./pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const ProductCatalogService = proto.oteldemo.ProductCatalogService;
  productCatalogClient = new ProductCatalogService(productCatalogServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    listProducts: async (_, __, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.listProducts({}, (err, response) => {
          if (err) reject(err);
          else resolve(response.products);
        });
      });
    },
    getProduct: async (_, { id }, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.getProduct({ id }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },
    searchProducts: async (_, { query }, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.searchProducts({ query }, (err, response) => {
          if (err) reject(err);
          else resolve(response.results);
        });
      });
    },
  },
};

module.exports = resolvers;
