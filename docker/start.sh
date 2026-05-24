#!/bin/sh
set -e

cd /var/www

# Railway define $PORT dinamicamente; 8080 é o padrão de fallback
PORT=${PORT:-8080}

# Gera o nginx.conf com a porta correta
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Aguarda o banco de dados ficar disponível
echo "Aguardando o banco de dados..."
until php artisan db:show > /dev/null 2>&1; do
    echo "  banco não disponível ainda, tentando em 3s..."
    sleep 3
done

echo "Banco disponível. Rodando migrations..."
php artisan migrate --force

echo "Criando link do storage..."
php artisan storage:link 2>/dev/null || true

echo "Cacheando configurações, rotas e views..."
php artisan optimize

echo "Iniciando PHP-FPM..."
php-fpm -D

echo "Iniciando Nginx na porta ${PORT}..."
exec nginx -g 'daemon off;'
