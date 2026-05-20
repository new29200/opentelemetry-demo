// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let cartClient;

const initGrpcClient = (cartServiceAddr) => {
  if (cartClient) return;

  const packageDefinition = protoLoader.loadSync('./pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const CartService = proto.oteldemo.CartService;
  cartClient = new CartService(cartServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    getCart: async (_, { userId }, context) => {
      initGrpcClient(context.cartServiceAddr);

      return new Promise((resolve, reject) => {
        cartClient.getCart({ user_id: userId }, (err, response) => {
          if (err) return reject(err);

          resolve({
            userId: response.user_id,
            items: response.items.map((item) => ({
              productId: item.product_id,
              quantity: item.quantity,
            })),
          });
        });
      });
    },
  },

  Mutation: {
    addItem: async (_, { userId, item }, context) => {
      initGrpcClient(context.cartServiceAddr);

      return new Promise((resolve, reject) => {
        cartClient.addItem(
          {
            user_id: userId,
            item: {
              product_id: item.productId,
              quantity: item.quantity,
            },
          },
          (err) => {
            if (err) return reject(err);
            resolve(true);
          }
        );
      });
    },

    emptyCart: async (_, { userId }, context) => {
      initGrpcClient(context.cartServiceAddr);

      return new Promise((resolve, reject) => {
        cartClient.emptyCart({ user_id: userId }, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
    },
  },
};

module.exports = resolvers;
