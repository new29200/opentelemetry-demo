# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-cart/package*.json ./
RUN npm install

COPY ./src/dgs-cart .

EXPOSE 4002

CMD [ "npm", "start" ]
