// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Ad, Address, Cart, CartItem, Money, PlaceOrderRequest, Product, ProductReview } from '../protos/demo';
import { IProductCart, IProductCartItem, IProductCheckout } from '../types/Cart';
import { AttributeNames } from '../utils/enums/AttributeNames';
import SessionGateway from './Session.gateway';
import { context, propagation } from "@opentelemetry/api";
import { apolloClient } from './graphql/client';
import {GET_CART, GET_PRODUCTS, GET_PRODUCT, GET_REVIEWS, GET_AVERAGE_REVIEW_SCORE, GET_CURRENCIES, GET_ADS, LIST_RECOMMENDATIONS, GET_QUOTE, ASK_PRODUCT_AI_ASSISTANT} from './graphql/queries';
import {ADD_ITEM, EMPTY_CART, PLACE_ORDER} from './graphql/mutations';

const { userId } = SessionGateway.getSession();

const fetchCart = async (): Promise<IProductCart> => {
  const result = await apolloClient.query({
    query: GET_CART,
    variables: { userId },
  });
  const cart = { ...result.data.getCart } as Cart;
  const items: IProductCartItem[] = await Promise.all(
    cart.items.map(async (item: CartItem) => {
      const productResult = await apolloClient.query({
        query: GET_PRODUCT,
        variables: { id: item.productId },
      });
      return {
        ...item,
        product: productResult.data.getProduct as Product,
      };
    })
  );
  return { ...cart, items } as IProductCart;
};

const Apis = () => ({
  async getCart(_currencyCode: string) {
    return fetchCart();
  },

  async addCartItem({ currencyCode: _currencyCode, ...item }: CartItem & { currencyCode: string }) {
    await apolloClient.mutate({
      mutation: ADD_ITEM,
      variables: { userId, item: { productId: item.productId, quantity: item.quantity } },
      refetchQueries: [{ query: GET_CART, variables: { userId } }],
    });
    return fetchCart();
  },

  async emptyCart() {
    await apolloClient.mutate({
      mutation: EMPTY_CART,
      variables: { userId },
      refetchQueries: [{ query: GET_CART, variables: { userId } }],
    });
    return fetchCart();
  },

  async getSupportedCurrencyList() {
    const result = await apolloClient.query({
      query: GET_CURRENCIES,
    });
    return [...result.data.getSupportedCurrencies] as string[];
  },

  async getShippingCost(itemList: IProductCartItem[], _currencyCode: string, address: Address) {
    const result = await apolloClient.query({
      query: GET_QUOTE,
      variables: {
        address: {
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state,
          country: address.country,
          zipCode: address.zipCode,
        },
        items: itemList.map(({ productId, quantity }) => ({ productId, quantity })),
      },
    });
    return result.data.getQuote as Money;
  },

  async placeOrder({ currencyCode: _currencyCode, ...order }: PlaceOrderRequest & { currencyCode: string }) {
    const result = await apolloClient.mutate({
      mutation: PLACE_ORDER,
      variables: {
        userId: order.userId,
        userCurrency: order.userCurrency,
        address: {
          streetAddress: order.address?.streetAddress,
          city: order.address?.city,
          state: order.address?.state,
          country: order.address?.country,
          zipCode: order.address?.zipCode,
        },
        email: order.email,
        creditCard: {
          creditCardNumber: order.creditCard?.creditCardNumber,
          creditCardCvv: order.creditCard?.creditCardCvv,
          creditCardExpirationYear: order.creditCard?.creditCardExpirationYear,
          creditCardExpirationMonth: order.creditCard?.creditCardExpirationMonth,
        },
      },
    });
    return result.data.placeOrder as IProductCheckout;
  },

  async listProducts(_currencyCode: string) {
    const result = await apolloClient.query({
      query: GET_PRODUCTS,
    });
    return [...result.data.listProducts] as Product[];
  },

  async getProduct(productId: string, _currencyCode: string) {
    const result = await apolloClient.query({
      query: GET_PRODUCT,
      variables: { id: productId },
    });
    return result.data.getProduct as Product;
  },

  async getProductReviews(productId: string) {
    const result = await apolloClient.query({
      query: GET_REVIEWS,
      variables: { productId },
    });
    return [...result.data.getProductReviews] as ProductReview[];
  },

  async getAverageProductReviewScore(productId: string) {
    const result = await apolloClient.query({
      query: GET_AVERAGE_REVIEW_SCORE,
      variables: { productId },
    });
    return result.data.getAverageProductReviewScore as string;
  },

  async askProductAIAssistant(productId: string, question: string) {
    const result = await apolloClient.query({
      query: ASK_PRODUCT_AI_ASSISTANT,
      variables: { productId, question },
    });
    return result.data.askProductAIAssistant as string;
  },

  async listRecommendations(productIds: string[], _currencyCode: string) {
    const result = await apolloClient.query({
      query: LIST_RECOMMENDATIONS,
      variables: { userId, productIds },
    });
    const recommendedProductIds = [...result.data.listRecommendations] as string[];
    const products = await Promise.all(
      recommendedProductIds.map(async (productId: string) => {
        const productResult = await apolloClient.query({
          query: GET_PRODUCT,
          variables: { id: productId },
        });
        return productResult.data.getProduct as Product;
      })
    );
    return products;
  },

  async listAds(contextKeys: string[]) {
    const result = await apolloClient.query({
      query: GET_ADS,
      variables: { contextKeys },
    });
    return [...result.data.getAds] as Ad[];
  },
});

const ApiGateway = new Proxy(Apis(), {
  get(target, prop, receiver) {
    const originalFunction = Reflect.get(target, prop, receiver);

    if (typeof originalFunction !== 'function') {
      return originalFunction;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (...args: any[]) {
      const baggage = propagation.getActiveBaggage() || propagation.createBaggage();
      const newBaggage = baggage.setEntry(AttributeNames.SESSION_ID, { value: userId });
      const newContext = propagation.setBaggage(context.active(), newBaggage);
      return context.with(newContext, () => {
        return Reflect.apply(originalFunction, undefined, args);
      });
    };
  },
});

export default ApiGateway;
