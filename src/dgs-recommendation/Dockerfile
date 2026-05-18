# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-recommendation/package*.json ./
RUN npm install

COPY ./src/dgs-recommendation .
COPY ./pb/demo.proto ./pb/

EXPOSE 4007

CMD [ "npm", "start" ]
