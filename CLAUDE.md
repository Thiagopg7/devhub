# DevHub — Portfolio Project

## Stack
- PHP 8.x + Laravel (Breeze, MVC)
- React.js (frontend via Vite)
- MySQL 8 (containerizado via Docker)

## Docker
O backend roda via Docker — use `docker exec` para comandos PHP/Artisan/Composer. O frontend (Vite) roda no host (ver seção NPM abaixo).

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

# Frontend / Vite — roda no HOST (o container `app` NÃO tem Node/npm)
# Requer Node 20.19+/22.12+ (vite ^8). Host tem Node 18 como padrão;
# usar nvm: `nvm use 22` antes de rodar.
npm run dev      # dev server com hot reload (precisa ficar rodando)
npm run build    # build de produção (gera public/build/manifest.json)

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
- Componentes React funcionais com hooks

### Arquitetura de camadas (controller / service)
- **Controller magro:** recebe a request, delega e devolve a response. CRUD simples
  (listagem, create/update/delete) usa Eloquent direto no controller — **não** criar
  service só para envelopar `Model::create()`.
- **Service:** só quando há lógica de negócio real — orquestração de vários models,
  transações, invalidação de cache, upload/manipulação de arquivos, regras de negócio.
  Ex. atuais: `PostService`, `PageService`, `RoleService`, `UserService`,
  `ConfigService`, `MenuService`, `FileUploadService`.
- **Sem Repository:** acesso a dados fica no Eloquent. Query reaproveitada vira
  query scope no model (ex.: `scopeActive`, `scopeOrdered`) — não um repositório.
- Regra prática: lógica de domínio (um `if`/`try` decidindo regra de negócio) nunca
  fica no controller; ou é trivial e fica no controller, ou vai para o service.

## Regras de commits
- Seguir Conventional Commits: `type(scope): descrição curta`
- Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`
- Título e mensagens de commit em PT-BR
- Nunca incluir `Co-Authored-By: Claude` nem nenhuma assinatura do Claude nas mensagens de commit
- Pode commitar direto na `main`; sincronizar com `origin/main` (fast-forward) antes de commitar

## Não fazer
- Não editar `.env`
- Não rodar `php artisan migrate:fresh` sem confirmar explicitamente
- Não instalar pacotes (composer/npm) sem perguntar antes
- Não rodar comandos PHP/Artisan direto no host — sempre via `docker exec app`
- Não fazer commit nem push sem perguntar antes ao usuário