#!/bin/sh
set -e

cd /var/www

# Railway define $PORT dinamicamente; 8080 é o padrão de fallback
PORT=${PORT:-8080}

# Gera o nginx.conf com a porta correta
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Aguarda o banco de dados ficar disponível
echo "Aguardando o banco de dados..."
until php -r "try { new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); } catch(Exception \$e) { exit(1); }" > /dev/null 2>&1; do
    echo "  banco não disponível ainda, tentando em 3s..."
    sleep 3
done

echo "Banco disponível. Rodando migrations..."
php artisan migrate --force

echo "Ajustando permissões do storage..."
mkdir -p /var/www/storage/app/public
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "Criando link do storage..."
php artisan storage:link --force 2>/dev/null || true

echo "Limpando cache da aplicação..."
php artisan cache:clear

echo "Cacheando configurações, rotas e views..."
php artisan optimize

echo "Iniciando PHP-FPM..."
php-fpm -D

echo "Iniciando queue worker..."
php artisan queue:work --sleep=3 --tries=3 --max-time=3600 &

echo "Iniciando Nginx na porta ${PORT}..."
exec nginx -g 'daemon off;'
