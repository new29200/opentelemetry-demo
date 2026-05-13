// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CartItem, OrderResult, PlaceOrderRequest } from '../protos/demo';
import { IProductCart } from '../types/Cart';
import { useCurrency } from './Currency.provider';
import SessionGateway from '../gateways/Session.gateway';
import {
  useGetCart,
  useAddToCart,
  useEmptyCart,
  usePlaceOrder
} from '../gateways/graphql/hooks';

interface IContext {
  cart: IProductCart;
  addItem(item: CartItem): void;
  emptyCart(): void;
  placeOrder(order: PlaceOrderRequest): Promise<OrderResult>;
}

export const Context = createContext<IContext>({
  cart: { userId: '', items: [] },
  addItem: () => {},
  emptyCart: () => {},
  placeOrder: () => Promise.resolve({} as OrderResult),
});

interface IProps {
  children: React.ReactNode;
}

export const useCart = () => useContext(Context);

const CartProvider = ({ children }: IProps) => {
  const { selectedCurrency } = useCurrency();
  const { userId } = SessionGateway.getSession();
  const queryClient = useQueryClient();

  const { data: cart = { userId: '', items: [] } } = useGetCart(userId, selectedCurrency);
  const addCartMutation = useAddToCart();
  const emptyCartMutation = useEmptyCart();
  const placeOrderMutation = usePlaceOrder();

  const addItem = useCallback(
    (item: CartItem) => addCartMutation.mutateAsync({ userId, item, currencyCode: selectedCurrency }),
    [addCartMutation, userId, selectedCurrency]
  );

  const emptyCart = useCallback(() => emptyCartMutation.mutateAsync(userId), [emptyCartMutation, userId]);

  const placeOrder = useCallback(
    (order: PlaceOrderRequest) => placeOrderMutation.mutateAsync({ order, currencyCode: selectedCurrency }),
    [placeOrderMutation, selectedCurrency]
  );

  const value = useMemo(() => ({ cart, addItem, emptyCart, placeOrder }), [cart, addItem, emptyCart, placeOrder]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default CartProvider;
