// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { apolloClient } from '../gateways/graphql/client';
import { GET_PRODUCTS, GET_PRODUCT } from '../gateways/graphql/queries';
import { gql } from '@apollo/client';

const CONVERT_CURRENCY = gql`
  query Convert($from: MoneyInput!, $toCode: String!) {
    convert(from: $from, toCode: $toCode) {
      currencyCode
      units
      nanos
    }
  }
`;

const defaultCurrencyCode = 'USD';

const ProductCatalogService = () => ({
  async convertPrice(price: any, currencyCode: string) {
    if (!currencyCode || currencyCode === defaultCurrencyCode) {
      return price;
    }

    const result = await apolloClient.query({
      query: CONVERT_CURRENCY,
      variables: {
        from: price,
        toCode: currencyCode
      },
    });
    return result.data.convert;
  },

  async listProducts(currencyCode = 'USD') {
    const result = await apolloClient.query({
      query: GET_PRODUCTS,
    });

    const productList = result.data.listProducts;
    return Promise.all(
      productList.map(async (product: any) => ({
        ...product,
        priceUsd: await this.convertPrice(product.priceUsd, currencyCode),
      }))
    );
  },

  async getProduct(id: string, currencyCode = 'USD') {
    const result = await apolloClient.query({
      query: GET_PRODUCT,
      variables: { id },
    });

    const product = result.data.getProduct;
    return {
      ...product,
      priceUsd: await this.convertPrice(product.priceUsd, currencyCode),
    };
  },
});

export default ProductCatalogService();
