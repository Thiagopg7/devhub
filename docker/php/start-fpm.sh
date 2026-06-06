#!/bin/sh
# Wrapper do php-fpm para o supervisor.
# Se o master do php-fpm morrer (ex.: OOM), seus workers ficam órfãos bloqueados
# em accept() segurando o socket — e o novo master se recusa a subir ("Another
# FPM instance seems to already listen"). Antes de iniciar, matamos qualquer
# php-fpm remanescente e removemos o socket, garantindo um boot limpo.
for proc in /proc/[0-9]*; do
    [ -r "$proc/cmdline" ] || continue
    if tr '\0' ' ' < "$proc/cmdline" 2>/dev/null | grep -q 'php-fpm'; then
        kill -9 "${proc#/proc/}" 2>/dev/null || true
    fi
done

rm -f /run/php-fpm.sock

exec php-fpm -F
