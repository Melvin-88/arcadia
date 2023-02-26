FROM node:12 AS builder

ARG API_HOST
ENV API_HOST=$API_HOST

RUN mkdir /app
WORKDIR /app
COPY --chown=node:node ./arcadia.backoffice.fe ./arcadia.backoffice.fe
COPY --chown=node:node ./arcadia.common.fe ./arcadia.common.fe

WORKDIR /app/arcadia.common.fe
RUN npm install

WORKDIR /app/arcadia.backoffice.fe
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /app/arcadia.backoffice.fe/dist/ /usr/share/nginx/html
COPY --from=builder /app/arcadia.backoffice.fe/nginx.conf /etc/nginx/conf.d/default.conf
