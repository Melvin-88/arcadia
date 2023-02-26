FROM node:14.15.0-alpine3.11

RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

USER node

WORKDIR /app
COPY --chown=node:node ./arcadia.monitoring.worker ./arcadia.monitoring.worker
COPY --chown=node:node ./arcadia.dal ./arcadia.dal
WORKDIR /app/arcadia.dal
RUN npm install
WORKDIR /app/arcadia.monitoring.worker

RUN npm install --scripts-prepend-node-path=auto
RUN npm run build
RUN npm prune --production=true

EXPOSE 3000
CMD ["node", "dist/main.js"]
