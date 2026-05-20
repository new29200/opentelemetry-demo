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
  LIST_RECOMMENDATIONS,
  GET_AVERAGE_REVIEW_SCORE,
  GET_PRODUCT,
  SEARCH_PRODUCTS,
  GET_QUOTE,
  ASK_PRODUCT_AI_ASSISTANT,
} from './queries';
import {
  ADD_ITEM,
  EMPTY_CART,
  PLACE_ORDER,
  SHIP_ORDER,
} from './mutations';

// QUERIES (récupération de données)

export function useListProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_PRODUCTS,
      });
      return result.data.listProducts;
    },
  });
}

export function useGetCart(userId: string) {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_CART,
        variables: { userId },
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

export function useListRecommendations(userId: string, productIds: string[]) {
  return useQuery({
    queryKey: ['recommendations', userId, productIds],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: LIST_RECOMMENDATIONS,
        variables: { userId, productIds },
      });
      return result.data.listRecommendations;
    },
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_PRODUCT,
        variables: { id },
      });
      return result.data.getProduct;
    },
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['searchProducts', query],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: SEARCH_PRODUCTS,
        variables: { query },
      });
      return result.data.searchProducts;
    },
  });
}

export function useGetQuote(address: any, items: any[]) {
  return useQuery({
    queryKey: ['quote', address, items],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: GET_QUOTE,
        variables: { address, items },
      });
      return result.data.getQuote;
    },
  });
}

export function useAskProductAIAssistant(productId: string, question: string) {
  return useQuery({
    queryKey: ['askProductAIAssistant', productId, question],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: ASK_PRODUCT_AI_ASSISTANT,
        variables: { productId, question },
      });
      return result.data.askProductAIAssistant;
    },
  });
}

// MUTATIONS (modifications de données)

export function useAddItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: any) =>
      apolloClient.mutate({
        mutation: ADD_ITEM,
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

export function useShipOrder() {
  return useMutation({
    mutationFn: (variables: any) =>
      apolloClient.mutate({
        mutation: SHIP_ORDER,
        variables,
      }),
  });
}