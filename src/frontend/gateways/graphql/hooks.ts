// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from './client';
import {
  GET_PRODUCTS,
  GET_CART,
  GET_REVIEWS,
  GET_CURRENCIES,
  GET_ADS,
  GET_RECOMMENDATIONS,
  GET_AVERAGE_REVIEW_SCORE,
  GET_PRODUCT,
  GET_SHIPPING_COST,
} from './queries';
import {
  ADD_TO_CART,
  EMPTY_CART,
  PLACE_ORDER,
  ASK_PRODUCT_AI_ASSISTANT,
} from './mutations';

// QUERIES (récupération de données)

export function useListProducts(currencyCode: string) {
  return useQuery({
    queryKey: ['products', currencyCode],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { currencyCode },
      });
      return result.data.listProducts;
    },
  });
}

export function useGetCart(userId: string, currencyCode: string) {
  return useQuery({
    queryKey: ['cart', userId, currencyCode],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_CART,
        variables: { userId, currencyCode },
      });
      return result.data.getCart;
    },
  });
}

export function useGetProductReviews(productId: string) {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_REVIEWS,
        variables: { productId },
      });
      return result.data.getProductReviews;
    },
  });
}

export function useGetAverageReviewScore(productId: string) {
  return useQuery({
    queryKey: ['productReviewAvgScore', productId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_AVERAGE_REVIEW_SCORE,
        variables: { productId },
      });
      return result.data.getAverageProductReviewScore;
    },
  });
}

export function useGetSupportedCurrencies() {
  return useQuery({
    queryKey: ['currency'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_CURRENCIES,
      });
      return result.data.getSupportedCurrencies;
    },
  });
}

export function useGetAds(contextKeys: string[]) {
  return useQuery({
    queryKey: ['ads', contextKeys],
    queryFn: async () => {
      if (contextKeys.length === 0) {
        return [];
      }
      const result = await apolloClient.query({
        query: GET_ADS,
        variables: { contextKeys },
      });
      return result.data.getAds;
    },
  });
}

export function useGetRecommendations(productIds: string[], currencyCode: string, sessionId: string) {
  return useQuery({
    queryKey: ['recommendations', productIds, 'selectedCurrency', currencyCode],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_RECOMMENDATIONS,
        variables: { productIds, currencyCode, sessionId },
      });
      return result.data.getRecommendations;
    },
  });
}

export function useGetProduct(productId: string, currencyCode: string) {
  return useQuery({
    queryKey: ['product', productId, currencyCode],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_PRODUCT,
        variables: { productId, currencyCode },
      });
      return result.data.getProduct;
    },
  });
}

export function useGetShippingCost(itemList: any[], currencyCode: string, address: any) {
  return useQuery({
    queryKey: ['shippingCost', itemList, currencyCode, address],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_SHIPPING_COST,
        variables: { itemList, currencyCode, address },
      });
      return result.data.getShippingCost;
    },
  });
}

// MUTATIONS (modifications de données)

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: any) =>
      apolloClient.mutate({
        mutation: ADD_TO_CART,
        variables,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useEmptyCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apolloClient.mutate({
        mutation: EMPTY_CART,
        variables: { userId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: any) =>
      apolloClient.mutate({
        mutation: PLACE_ORDER,
        variables,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useAskProductAIAssistant() {
  return useMutation({
    mutationFn: (variables: any) =>
      apolloClient.mutate({
        mutation: ASK_PRODUCT_AI_ASSISTANT,
        variables,
      }),
  });
}