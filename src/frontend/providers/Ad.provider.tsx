// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useMemo } from 'react';
import { Ad, Money, Product } from '../protos/demo';
import { useCurrency } from './Currency.provider';
import SessionGateway from '../gateways/Session.gateway';
import { useGetAds, useGetRecommendations } from '../gateways/graphql/hooks';

interface IContext {
  recommendedProductList: Product[];
  adList: Ad[];
}

export const Context = createContext<IContext>({
  recommendedProductList: [],
  adList: [],
});

interface IProps {
  children: React.ReactNode;
  productIds: string[];
  contextKeys: string[];
}

export const useAd = () => useContext(Context);

const AdProvider = ({ children, productIds, contextKeys }: IProps) => {
  const { selectedCurrency } = useCurrency();
  const { userId } = SessionGateway.getSession();

  const { data: adList = [] } = useGetAds(contextKeys);
  const { data: recommendedProductList = [] } = useGetRecommendations(productIds, selectedCurrency, userId);

  const value = useMemo(
    () => ({
      adList,
      recommendedProductList,
    }),
    [adList, recommendedProductList]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AdProvider;
