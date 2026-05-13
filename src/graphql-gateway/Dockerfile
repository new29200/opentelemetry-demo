# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/graphql-gateway/package*.json ./
RUN npm install

COPY ./src/graphql-gateway .

EXPOSE 4000

CMD [ "npm", "start" ]
