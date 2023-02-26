FROM node:12 AS builder

ARG API_HOST
ARG BASE_URL
ARG NODE_ENV

RUN echo "NODE_ENV=$NODE_ENV\nAPI_HOST=$API_HOST\nBASE_URL=$BASE_URL" > .env

RUN mkdir /app
WORKDIR /app
COPY --chown=node:node ./arcadia.voucher.portal ./arcadia.voucher.portal
COPY --chown=node:node ./arcadia.common.fe ./arcadia.common.fe

WORKDIR /app/arcadia.common.fe
RUN npm install

WORKDIR /app/arcadia.voucher.portal
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /app/arcadia.voucher.portal/dist/ /usr/share/nginx/html
COPY --from=builder /app/arcadia.voucher.portal/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
