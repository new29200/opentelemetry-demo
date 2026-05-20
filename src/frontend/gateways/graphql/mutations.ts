// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

// gateways/graphql/mutations.ts
import { gql } from '@apollo/client';

// Mutation pour ajouter au panier
export const ADD_ITEM = gql`
  mutation AddItem($userId: String!, $item: CartItemInput!) {
    addItem(userId: $userId, item: $item)
  }
`;

// Mutation pour vider le panier
export const EMPTY_CART = gql`
  mutation EmptyCart($userId: String!) {
    emptyCart(userId: $userId)
  }
`;

// Mutation pour commander
export const PLACE_ORDER = gql`
  mutation PlaceOrder(
    $userId: String!
    $userCurrency: String!
    $address: AddressInput!
    $email: String!
    $creditCard: CreditCardInfoInput!
  ) {
    placeOrder(
      userId: $userId
      userCurrency: $userCurrency
      address: $address
      email: $email
      creditCard: $creditCard
    ) {
      orderId
      shippingTrackingId
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
      items {
        item {
          productId
          quantity
        }
        cost {
          currencyCode
          units
          nanos
        }
      }
    }
  }
`;

// Mutation pour lancer l'expédition
export const SHIP_ORDER = gql`
  mutation ShipOrder($address: AddressInput!, $items: [CartItemInput!]!) {
    shipOrder(address: $address, items: $items)
  }
`;