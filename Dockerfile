# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM webdevops/php-nginx:8.3-alpine as production-stage

ENV WEB_DOCUMENT_ROOT /app/public

ENV APP_ENV ${VITE_ENV}

WORKDIR /app

COPY --from=build-stage /app/dist /app/public

COPY --from=build-stage /app/version /app/version

RUN apk add nano

COPY docker/10-general.conf /opt/docker/etc/nginx/vhost.common.d/
COPY docker/10-location-root.conf /opt/docker/etc/nginx/vhost.common.d/

RUN chown -R application:application .
