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
    zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir usuário padrão
USER appuser