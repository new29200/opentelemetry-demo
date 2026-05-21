// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { apolloClient } from '../gateways/graphql/client';
import { gql } from '@apollo/client';
import ApiGateway from '../gateways/Api.gateway';

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
    const productList = await ApiGateway.listProducts(currencyCode);
    return Promise.all(
      productList.map(async (product: any) => ({
        ...product,
        priceUsd: await this.convertPrice(product.priceUsd, currencyCode),
      }))
    );
  },

  async getProduct(id: string, currencyCode = 'USD') {
    const product = await ApiGateway.getProduct(id, currencyCode);
    return {
      ...product,
      priceUsd: await this.convertPrice(product.priceUsd, currencyCode),
    };
  },
});

export default ProductCatalogService();
