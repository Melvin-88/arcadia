FROM node:14.15.0-alpine3.11

RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3000

CMD node register-emu-chips.js && node arcadia_robot.js
