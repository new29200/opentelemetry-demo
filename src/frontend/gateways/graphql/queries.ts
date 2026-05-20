// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

// gateways/graphql/queries.ts
import { gql } from '@apollo/client';

// Requête pour récupérer les produits
export const GET_PRODUCTS = gql`
  query ListProducts {
    listProducts {
      id
      name
      description
      picture
      categories
      priceUsd {
        currencyCode
        units
        nanos
      }
    }
  }
`;

// Requête pour récupérer le panier
export const GET_CART = gql`
  query GetCart($userId: String!) {
    getCart(userId: $userId) {
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
      username
      description
      score
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
      redirectUrl
      text
    }
  }
`;

export const LIST_RECOMMENDATIONS = gql`
  query ListRecommendations($userId: String!, $productIds: [String!]!) {
    listRecommendations(userId: $userId, productIds: $productIds)
  }
`;

export const GET_AVERAGE_REVIEW_SCORE = gql`
  query GetAverageProductReviewScore($productId: String!) {
    getAverageProductReviewScore(productId: $productId)
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      description
      picture
      categories
      priceUsd {
        currencyCode
        units
        nanos
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    searchProducts(query: $query) {
      id
      name
      description
      picture
      categories
      priceUsd {
        currencyCode
        units
        nanos
      }
    }
  }
`;

export const GET_QUOTE = gql`
  query GetQuote($address: AddressInput!, $items: [CartItemInput!]!) {
    getQuote(address: $address, items: $items) {
      currencyCode
      units
      nanos
    }
  }
`;

export const ASK_PRODUCT_AI_ASSISTANT = gql`
  query AskProductAIAssistant($productId: String!, $question: String!) {
    askProductAIAssistant(productId: $productId, question: $question)
  }
`;