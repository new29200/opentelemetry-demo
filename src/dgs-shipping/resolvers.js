// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let shippingClient;

const initGrpcClient = (shippingServiceAddr) => {
  if (shippingClient) return;

  const packageDefinition = protoLoader.loadSync('./pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const ShippingService = proto.oteldemo.ShippingService;

  shippingClient = new ShippingService(
    shippingServiceAddr,
    grpc.credentials.createInsecure()
  );
};

const convertAddress = (address) => ({
  street_address: address.streetAddress,
  city: address.city,
  state: address.state,
  country: address.country,
  zip_code: address.zipCode,
});

const convertItems = (items) =>
  items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }));

const mapMoney = (money) => ({
  currencyCode: money.currency_code,
  units: Number(money.units),
  nanos: money.nanos,
});

const resolvers = {
  Query: {
    getQuote: async (_, { address, items }, context) => {
      initGrpcClient(context.shippingServiceAddr);

      return new Promise((resolve, reject) => {
        shippingClient.getQuote(
          {
            address: convertAddress(address),
            items: convertItems(items),
          },
          (err, response) => {
            if (err) return reject(err);

            resolve(mapMoney(response.cost_usd));
          }
        );
      });
    },
  },

  Mutation: {
    shipOrder: async (_, { address, items }, context) => {
      initGrpcClient(context.shippingServiceAddr);

      return new Promise((resolve, reject) => {
        shippingClient.shipOrder(
          {
            address: convertAddress(address),
            items: convertItems(items),
          },
          (err, response) => {
            if (err) return reject(err);

            resolve(response.tracking_id);
          }
        );
      });
    },
  },
};

module.exports = resolvers;
