// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { apolloClient } from '../gateways/graphql/client';
import { GET_REVIEWS, GET_AVERAGE_REVIEW_SCORE, ASK_PRODUCT_AI_ASSISTANT } from '../gateways/graphql/queries';

const ProductReviewService = () => ({
  async getProductReviews(id: string) {
    const result = await apolloClient.query({
      query: GET_REVIEWS,
      variables: { productId: id },
    });
    return result.data.getProductReviews;
  },
  async getAverageProductReviewScore(id: string) {
    const result = await apolloClient.query({
      query: GET_AVERAGE_REVIEW_SCORE,
      variables: { productId: id },
    });
    return result.data.getAverageProductReviewScore;
  },
  async askProductAIAssistant(id: string, question: string) {
    const result = await apolloClient.query({
      query: ASK_PRODUCT_AI_ASSISTANT,
      variables: { productId: id, question },
    });
    return result.data.askProductAIAssistant;
  },
});

export default ProductReviewService();
