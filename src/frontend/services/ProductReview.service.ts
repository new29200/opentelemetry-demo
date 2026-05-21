// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import ApiGateway from '../gateways/Api.gateway';

const ProductReviewService = () => ({
  async getProductReviews(id: string) {
    return ApiGateway.getProductReviews(id);
  },
  async getAverageProductReviewScore(id: string) {
    return ApiGateway.getAverageProductReviewScore(id);
  },
  async askProductAIAssistant(id: string, question: string) {
    return ApiGateway.askProductAIAssistant(id, question);
  },
});

export default ProductReviewService();
