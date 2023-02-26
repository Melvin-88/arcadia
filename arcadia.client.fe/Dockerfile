FROM node:12 AS builder

ARG API_ENDPOINT
ENV API_ENDPOINT=$API_ENDPOINT

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
