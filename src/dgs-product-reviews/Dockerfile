# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-product-reviews/package*.json ./
RUN npm install

COPY ./src/dgs-product-reviews .
COPY ./pb/demo.proto ./pb/

EXPOSE 4006

CMD [ "npm", "start" ]
