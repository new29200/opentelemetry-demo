# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-currency/package*.json ./
RUN npm install

COPY ./src/dgs-currency .

EXPOSE 4003

CMD [ "npm", "start" ]
