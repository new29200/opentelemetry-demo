# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-checkout/package*.json ./
RUN npm install

COPY ./src/dgs-checkout .

EXPOSE 4001

CMD [ "npm", "start" ]
