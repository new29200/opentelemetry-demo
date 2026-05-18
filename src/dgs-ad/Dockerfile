# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0

FROM node:24-alpine

WORKDIR /app

COPY ./src/dgs-ad/package*.json ./
RUN npm install

COPY ./src/dgs-ad .
COPY ./pb/demo.proto ./pb/

EXPOSE 4004

CMD [ "npm", "start" ]
