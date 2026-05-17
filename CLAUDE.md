# DevHub — Portfolio Project

## Stack
- PHP 8.x + Laravel (Breeze, MVC)
- React.js (frontend via Vite)
- MySQL 8 (containerizado via Docker)

## Docker
O projeto roda inteiramente via Docker. Sempre use `docker exec` para rodar comandos dentro do container.

### Containers
| Container   | Função                        |
|-------------|-------------------------------|
| `app`       | PHP-FPM (Laravel)             |
| `webserver` | Nginx — acesso em http://devhub.local |
| `db`        | MySQL 8 — porta 3307 no host  |

### Comandos principais
```bash
# Subir o ambiente
docker compose up -d

# Rodar comandos Laravel
docker exec app php artisan <comando>
docker exec app composer <comando>

# NPM (se não rodar no host)
docker exec app npm run dev
docker exec app npm run build

# Acessar o banco direto (do host)
mysql -h 127.0.0.1 -P 3307 -u user -psecret app_db
```

## Banco de dados
- Host interno (entre containers): `db:3306`
- Host externo (do WSL/host): `127.0.0.1:3307`
- Database: `app_db` | User: `user`
- **Testes:** SQLite in-memory (`.env.testing`) — rodar com `docker exec app php artisan test`

## Estrutura relevante
- `app/Http/Controllers/` — controllers
- `app/Models/` — Eloquent models
- `resources/js/` — componentes React
- `routes/web.php` e `routes/api.php` — rotas
- `docker/nginx/` — configuração do Nginx

## Contexto atual
- CRUD de posts implementado
- 2 endpoints de API disponíveis
- Branch `tests` tem testes automatizados da API

## Padrões a seguir
- PSR-12 no PHP
- Repository Pattern para acesso a dados quando pertinente
- Service Layer para lógica de negócio complexa
- Componentes React funcionais com hooks
- Nunca commitar direto na `main`

## Regras de commits
- Seguir Conventional Commits: `type(scope): descrição curta`
- Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`
- Título e mensagens de commit em PT-BR
- Nunca incluir `Co-Authored-By: Claude` nem nenhuma assinatura do Claude nas mensagens de commit

## Não fazer
- Não editar `.env`
- Não rodar `php artisan migrate:fresh` sem confirmar explicitamente
- Não instalar pacotes (composer/npm) sem perguntar antes
- Não rodar comandos PHP/Artisan direto no host — sempre via `docker exec app`
- Não fazer commit nem push sem perguntar antes ao usuário