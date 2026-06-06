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
# Recria a estrutura do storage caso um volume vazio tenha sido montado por cima
mkdir -p /var/www/storage/app/public \
         /var/www/storage/framework/cache \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/logs
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "Criando link do storage..."
php artisan storage:link --force 2>/dev/null || true

echo "Consolidando conteúdo (seeders idempotentes)..."
# A falha do seed não pode derrubar o boot do servidor — apenas avisa.
php artisan db:seed --force || echo "AVISO: db:seed falhou — seguindo o boot do servidor"

echo "Limpando cache da aplicação..."
php artisan cache:clear

echo "Cacheando configurações, rotas e views..."
php artisan optimize

# Entrega o controle ao supervisor: ele mantém php-fpm, nginx e a fila vivos
# e reinicia qualquer um que cair (evita o 502 permanente por php-fpm morto).
echo "Iniciando supervisor (php-fpm + nginx + queue) na porta ${PORT}..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
