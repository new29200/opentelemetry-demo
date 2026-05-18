# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-shipping/package*.json ./
RUN npm install

COPY ./src/dgs-shipping .
COPY ./pb/demo.proto ./pb/

EXPOSE 4008

CMD [ "npm", "start" ]
