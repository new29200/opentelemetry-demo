# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-product-catalog/package*.json ./
RUN npm install

COPY ./src/dgs-product-catalog .
COPY ./pb/demo.proto ./pb/

EXPOSE 4005

CMD [ "npm", "start" ]
