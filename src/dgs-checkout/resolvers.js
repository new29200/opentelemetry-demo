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
  Query: {
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
            email: email,
            credit_card: {
              credit_card_number: creditCard.creditCardNumber,
              credit_card_cvv: creditCard.creditCardCvv,
              credit_card_expiration_year: creditCard.creditCardExpirationYear,
              credit_card_expiration_month: creditCard.creditCardExpirationMonth,
            },
          },
          (err, response) => {
            if (err) reject(err);
            else resolve(response.order);
          }
        );
      });
    },
  },
};

module.exports = resolvers;
