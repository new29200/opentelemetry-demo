// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: 'currency',
        url: process.env.DGS_CURRENCY_URL || 'http://dgs-currency:4003',
      },
      {
         name: 'checkout',
         url: process.env.DGS_CHECKOUT_URL || 'http://dgs-checkout:4001',
      },
      {
         name: 'cart',
         url: process.env.DGS_CART_URL || 'http://dgs-cart:4002',
      },
      {
          name: 'ad',
          url: process.env.DGS_AD_URL || 'http://dgs-ad:4004',
      },
      {
          name: 'product-catalog',
          url: process.env.DGS_PRODUCT_CATALOG_URL || 'http://dgs-product-catalog:4005',
      },
      {
          name: 'product-reviews',
          url: process.env.DGS_PRODUCT_REVIEWS_URL || 'http://dgs-product-reviews:4006',
      },
      {
          name: 'recommendation',
          url: process.env.DGS_RECOMMENDATION_URL || 'http://dgs-recommendation:4007',
      },
      {
          name: 'shipping',
          url: process.env.DGS_SHIPPING_URL || 'http://dgs-shipping:4008',
      }
    ],
  }),
});

module.exports = gateway;
