// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let adClient;

const initGrpcClient = (adServiceAddr) => {
  if (adClient) return;

  const packageDefinition = protoLoader.loadSync('./pb/demo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition);
  const AdService = proto.oteldemo.AdService;
  adClient = new AdService(adServiceAddr, grpc.credentials.createInsecure());
};

const resolvers = {
  Query: {
    getAds: async (_, { contextKeys }, context) => {
      initGrpcClient(context.adServiceAddr);

      return new Promise((resolve, reject) => {
        adClient.getAds(
          { context_keys: contextKeys },
          (err, response) => {
            if (err) return reject(err);

            resolve(
              response.ads.map((ad) => ({
                redirectUrl: ad.redirect_url,
                text: ad.text,
              }))
            );
          }
        );
      });
    },
  },
};

module.exports = resolvers;
