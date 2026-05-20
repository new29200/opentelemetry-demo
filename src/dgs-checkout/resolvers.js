// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let checkoutClient;

const initGrpcClient = (checkoutServiceAddr) => {
  if (checkoutClient) return;

  const packageDefinition = protoLoader.loadSync('./pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const CheckoutService = proto.oteldemo.CheckoutService;
  checkoutClient = new CheckoutService(checkoutServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Mutation: {
    placeOrder: async (_, { userId, userCurrency, address, email, creditCard }, context) => {
      initGrpcClient(context.checkoutServiceAddr);

      return new Promise((resolve, reject) => {
        checkoutClient.placeOrder(
          {
            user_id: userId,
            user_currency: userCurrency,
            address: {
              street_address: address.streetAddress,
              city: address.city,
              state: address.state,
              country: address.country,
              zip_code: address.zipCode,
            },
            email,
            credit_card: {
              credit_card_number: creditCard.creditCardNumber,
              credit_card_cvv: creditCard.creditCardCvv,
              credit_card_expiration_year: creditCard.creditCardExpirationYear,
              credit_card_expiration_month: creditCard.creditCardExpirationMonth,
            },
          },
          (err, response) => {
            if (err) return reject(err);

            const order = response.order;

            resolve({
              orderId: order.order_id,
              shippingTrackingId: order.shipping_tracking_id,
              shippingAddress: {
                streetAddress: order.shipping_address.street_address,
                city: order.shipping_address.city,
                state: order.shipping_address.state,
                country: order.shipping_address.country,
                zipCode: order.shipping_address.zip_code,
              },
              shippingCost: {
                currencyCode: order.shipping_cost.currency_code,
                units: order.shipping_cost.units,
                nanos: order.shipping_cost.nanos,
              },
              items: order.items.map((orderItem) => ({
                item: {
                  productId: orderItem.item.product_id,
                  quantity: orderItem.item.quantity,
                },
                cost: {
                  currencyCode: orderItem.cost.currency_code,
                  units: orderItem.cost.units,
                  nanos: orderItem.cost.nanos,
                },
              })),
            });
          }
        );
      });
    },
  },
};

module.exports = resolvers;
