FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /var/www

COPY . .

CMD ["php-fpm"]
