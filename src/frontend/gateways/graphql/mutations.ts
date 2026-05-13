// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

// gateways/graphql/mutations.ts
import { gql } from '@apollo/client';

// ← Mutation pour ajouter au panier
export const ADD_TO_CART = gql`
  mutation AddToCart($userId: String!, $item: CartItemInput!, $currencyCode: String!) {
    addToCart(userId: $userId, item: $item, currencyCode: $currencyCode) {
      userId
      items {
        productId
        quantity
      }
    }
  }
`;

// ← Mutation pour vider le panier
export const EMPTY_CART = gql`
  mutation EmptyCart($userId: String!) {
    emptyCart(userId: $userId) {
      userId
      items {
        productId
        quantity
      }
    }
  }
`;

// ← Mutation pour commander
export const PLACE_ORDER = gql`
  mutation PlaceOrder($order: PlaceOrderRequestInput!, $currencyCode: String!) {
    placeOrder(order: $order, currencyCode: $currencyCode) {
      orderId
      shippingAddress {
        streetAddress
        city
        state
        country
        zipCode
      }
      shippingCost {
        currencyCode
        units
        nanos
      }
    }
  }
`;

// ← Mutation pour poser une question à l'IA
export const ASK_PRODUCT_AI_ASSISTANT = gql`
  mutation AskProductAIAssistant($productId: String!, $question: String!) {
    askProductAIAssistant(productId: $productId, question: $question)
  }
`;