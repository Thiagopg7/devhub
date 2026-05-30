# NOTES — trabalho em andamento

Anotações de continuidade para a revisão do projeto (portfólio). Não é doc de usuário — ver `README.md` para isso.

## Onde paramos

Em andamento na branch `dev`: reimplementação do **cache da API** e uma série de ajustes de qualidade. O cache (item 1) está **completo e testado**; o restante está pendente.

### Pré-requisito ao retomar (após `git pull` na `dev`)

Ajustar o `.env` local (não versionado):

```env
CACHE_STORE=redis
REDIS_HOST=redis
```

> `REDIS_HOST=redis` é o nome do serviço Docker. Dentro do container `app`, `127.0.0.1` aponta pro próprio container — por isso o Redis "não funcionava" com o valor antigo. O `.env.example` já está correto.

Depois:

```bash
docker exec app php artisan config:clear
docker exec app php artisan cache:clear
docker exec app php artisan test   # 260 passando
```

Em produção (Railway): confirmar `CACHE_STORE=redis` apontando pro app Redis.

## Feito

- [x] **Cache da API com Redis + `Cache::tags`** nos 5 endpoints (categories, menu, technologies, posts paginado/filtrado, pages).
  - `App\Support\ApiCache` (helper `remember`/`flush` por tag, TTL 1h).
  - Cacheia só **arrays serializados** do Resource (`->response()->getData(true)`), nunca models Eloquent — era a desserialização do trait Sluggable que quebrava o cache anterior.
  - Invalidação por model events + dependências cruzadas (post↔categoria, galeria→página) e no `ReorderController` (usa `DB::table`, não dispara eventos — corrige também `menu.shared` obsoleto).
- [x] **`api:generate-token`** reescrito pro Sanctum (referenciava o model `ApiToken`, removido na migração).
- [x] **Corrigir docs** — `README.md` e `CLAUDE.md` falavam em "invalidação via observers"; agora descrevem **model events + `Cache::tags`** (dependências cruzadas, `ReorderController`, cache só de array serializado, TTL 1h).
- [x] **Documentar `/api/technologies`** — adicionado na tabela de endpoints do `README.md` e no `public/docs/openapi.yaml` (tag + schema `Technology` + path).
- [x] **Swagger UI self-hosted** — `/api/docs` carregava o swagger-ui do CDN `unpkg.com`, bloqueado pela CSP estrita do nginx. Assets baixados pra `public/vendor/swagger-ui/` (v5.32.6, versionados) e servidos do próprio domínio; CSP intacta. (As fontes `data:`/`typekit` que aparecem no console vêm de extensão do navegador, não da app — somem em janela anônima.)
- [x] **Login da API stateless** — `Api/AuthController::login` trocou `Auth::attempt()` (guard de sessão) por `User::where('email')` + `Hash::check()` + `createToken()`. Teste `login nao abre sessao` (`assertGuest`) garante a statelessness.

## Pendente (ordem de prioridade)

- [ ] **5. Índices de DB** — sem índice em `is_active`, que é filtrado em toda query pública. Migration com índice composto `(is_active, created_at)` em `posts` e simples em `categories`/`technologies`/`menu_items`.
- [ ] **6. Polimento de portfólio** — badges de CI/cobertura no README, GIF/vídeo do admin, rate limiting nos demais endpoints da API (hoje só `/login` tem throttle), health check.

## Convenções

- Commits: Conventional Commits em PT-BR, sem assinatura do Claude.
- Trabalho na `dev`; merge pra `main` só quando for subir em produção.
- Código com comentários ao mínimo.
