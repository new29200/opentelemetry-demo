// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

// gateways/graphql/queries.ts
import { gql } from '@apollo/client';

// Requête pour récupérer les produits
export const GET_PRODUCTS = gql`
  query ListProducts($currencyCode: String!) {
    listProducts(currencyCode: $currencyCode) {
      id
      name
      description
      priceUsd {
        units
        nanos
      }
    }
  }
`;

// Requête pour récupérer le panier
export const GET_CART = gql`
  query GetCart($userId: String!, $currencyCode: String!) {
    getCart(userId: $userId, currencyCode: $currencyCode) {
      userId
      items {
        productId
        quantity
      }
    }
  }
`;

// Requête pour récupérer les avis
export const GET_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    getProductReviews(productId: $productId) {
      id
      productId
      displayName
      rating
      text
    }
  }
`;

export const GET_CURRENCIES = gql`
  query GetSupportedCurrencies {
    getSupportedCurrencies
  }
`;

export const GET_ADS = gql`
  query GetAds($contextKeys: [String!]!) {
    getAds(contextKeys: $contextKeys) {
      id
      redirectUrl
      text
    }
  }
`;

export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($productIds: [String!]!, $currencyCode: String!, $sessionId: String!) {
    getRecommendations(productIds: $productIds, currencyCode: $currencyCode, sessionId: $sessionId) {
      id
      name
      description
      picture
      priceUsd {
        currencyCode
        units
        nanos
      }
    }
  }
`;

export const GET_AVERAGE_REVIEW_SCORE = gql`
  query GetAverageProductReviewScore($productId: String!) {
    getAverageProductReviewScore(productId: $productId)
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($productId: String!, $currencyCode: String!) {
    getProduct(productId: $productId, currencyCode: $currencyCode) {
      id
      name
      description
      picture
      priceUsd {
        currencyCode
        units
        nanos
      }
    }
  }
`;

export const GET_SHIPPING_COST = gql`
  query GetShippingCost($itemList: [CartItemInput!]!, $currencyCode: String!, $address: AddressInput!) {
    getShippingCost(itemList: $itemList, currencyCode: $currencyCode, address: $address) {
      currencyCode
      units
      nanos
    }
  }
`;