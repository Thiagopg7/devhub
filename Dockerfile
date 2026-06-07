FROM php:8.3-fpm

ARG UID=1000
ARG GID=1000

# Criar usuário com mesmo UID do host
RUN groupadd -g $GID appuser \
    && useradd -u $UID -g appuser -m appuser

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libxml2-dev \
    libzip-dev \
    zip \
    curl

# Instalar extensões PHP necessárias
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    xml \
    dom \
    zip \
    opcache

# Configuração do PHP e OPcache
COPY docker/php/production.ini /usr/local/etc/php/conf.d/production.ini
COPY docker/php/opcache.ini    /usr/local/etc/php/conf.d/opcache.ini

# Instalar phpredis e PCOV (driver de coverage para testes)
RUN pecl install redis pcov \
    && docker-php-ext-enable redis pcov

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Definir usuário padrão
USER appuser