// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let currencyClient;

const initGrpcClient = (currencyServiceAddr) => {
  if (currencyClient) return;

  const packageDefinition = protoLoader.loadSync('../../../pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const CurrencyService = proto.oteldemo.CurrencyService;
  currencyClient = new CurrencyService(currencyServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    getSupportedCurrencies: async (_, __, context) => {
      initGrpcClient(context.currencyServiceAddr);

      return new Promise((resolve, reject) => {
        currencyClient.getSupportedCurrencies({}, (err, response) => {
          if (err) reject(err);
          else resolve(response.currency_codes);
        });
      });
    },

    convert: async (_, { from, toCode }, context) => {
      initGrpcClient(context.currencyServiceAddr);

      return new Promise((resolve, reject) => {
        currencyClient.convert(
          {
            from: {
              currency_code: from.currencyCode,
              units: from.units,
              nanos: from.nanos,
            },
            to_code: toCode,
          },
          (err, response) => {
            if (err) reject(err);
            else resolve(response);
          }
        );
      });
    },
  },
};

module.exports = resolvers;