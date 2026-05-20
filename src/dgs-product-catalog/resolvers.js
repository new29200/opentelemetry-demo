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

const mapMoney = (money) => ({
  currencyCode: money.currency_code,
  units: Number(money.units),
  nanos: money.nanos,
});

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  picture: product.picture,
  priceUsd: mapMoney(product.price_usd),
  categories: product.categories,
});

const resolvers = {
  Query: {
    listProducts: async (_, __, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.listProducts({}, (err, response) => {
          if (err) return reject(err);

          resolve(response.products.map(mapProduct));
        });
      });
    },

    getProduct: async (_, { id }, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.getProduct({ id }, (err, response) => {
          if (err) return reject(err);

          resolve(mapProduct(response));
        });
      });
    },

    searchProducts: async (_, { query }, context) => {
      initGrpcClient(context.productCatalogServiceAddr);

      return new Promise((resolve, reject) => {
        productCatalogClient.searchProducts({ query }, (err, response) => {
          if (err) return reject(err);

          resolve(response.results.map(mapProduct));
        });
      });
    },
  },
};

module.exports = resolvers;
