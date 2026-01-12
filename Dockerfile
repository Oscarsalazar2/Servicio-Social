# ---------- Build Vite ----------
FROM node:20-alpine AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- PHP + Nginx ----------
FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    nginx supervisor bash \
    icu-dev oniguruma-dev libzip-dev zip unzip \
    postgresql-dev \
 && docker-php-ext-install pdo pdo_pgsql intl mbstring zip opcache

WORKDIR /var/www/html
COPY . .

COPY --from=assets /app/public/build /var/www/html/public/build

COPY .render/nginx.conf /etc/nginx/nginx.conf
COPY .render/supervisord.conf /etc/supervisord.conf

RUN chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 10000
CMD ["/usr/bin/supervisord","-c","/etc/supervisord.conf"]
