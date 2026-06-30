FROM node:22-alpine AS build

ENV VITE_YM_ID="106609413"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm -f /docker-entrypoint.d/*.sh /docker-entrypoint.d/*.envsh
COPY docker/runtime-config-entrypoint.sh /docker-entrypoint.d/99-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/99-runtime-config.sh

USER nginx

EXPOSE 8080
