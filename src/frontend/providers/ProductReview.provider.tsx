// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useEffect, useMemo } from 'react';
import { ProductReview } from '../protos/demo';
import { useGetProductReviews, useGetAverageReviewScore } from '../gateways/graphql/hooks';

interface IContext {
    // null = not loaded yet; [] = loaded with no reviews; array = loaded with reviews.
    productReviews: ProductReview[] | null;
    loading: boolean;
    error: Error | null;
    averageScore: string | null;
}

export const Context = createContext<IContext>({
    productReviews: null,
    loading: false,
    error: null,
    averageScore: null,
});

interface IProps {
    children: React.ReactNode;
    productId: string;
}

//export const useProductReview = () => useContext(Context);
export const useProductReview = () => {
    const value = useContext(Context);
    return value;
};

const ProductReviewProvider = ({ children, productId }: IProps) => {
    const {
        data: reviewsData,
        isLoading,
        isFetching,
        isError,
        error,
        isSuccess,
    } = useGetProductReviews(productId);

    const productReviews: ProductReview[] | null = isSuccess
        ? Array.isArray(reviewsData)
            ? reviewsData
            : []
        : null;

    const loading = isLoading || isFetching;

    const currentError: Error | null = isError
        ? error instanceof Error
            ? error
            : new Error('Unknown error')
        : null;

    const { data: averageScore = '' } = useGetAverageReviewScore(productId);

    const value = useMemo(
        () => ({
            productReviews,
            loading,
            error: currentError,
            averageScore,
        }),
        [productReviews, loading, currentError, averageScore]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ProductReviewProvider;
