FROM node:18.18.2-alpine3.17
WORKDIR /srv
ADD ./package.json /srv/package.json

RUN apk add --update bind-tools openssl

RUN npm install

COPY . .
RUN cat ./src/config/env.js.example > ./src/config/env.js
RUN export NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm install -g serve
RUN export PATH="$PATH:$(npm list -g | head -1)"

EXPOSE 3000