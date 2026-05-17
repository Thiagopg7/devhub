# DevHub

Hub de publicação de conteúdo sobre tecnologia e inovação. Projeto de portfólio que demonstra uma aplicação full-stack completa com painel administrativo, API RESTful autenticada e frontend público.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | PHP 8.3 + Laravel 13 |
| Frontend | React 18 + Inertia.js |
| Editor de texto | TipTap |
| Estilização | Tailwind CSS 3 |
| Build | Vite 8 |
| Banco de dados | MySQL 8 |
| Infra | Docker + Nginx |

## Funcionalidades

- **Frontend público** — homepage com posts em destaque, listagem paginada, página individual de post com prose rendering
- **Painel administrativo** — CRUD completo de posts e categorias, editor rich-text (TipTap), upload de banner, toggle de status ativo/inativo
- **API RESTful** — endpoints autenticados via token para consulta de posts
- **Autenticação** — login/registro via Laravel Breeze

## Arquitetura

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # PostController, CategoryController, ToggleController
│   │   ├── Api/            # PostController (API pública)
│   │   └── BlogController  # Rotas públicas do blog
│   ├── Middleware/
│   │   └── ValidateApiToken.php
│   ├── Requests/           # Form Requests com validação
│   └── Resources/
│       └── PostResource.php
├── Models/                 # User, Post, Category, ApiToken
└── Services/               # PostService, CategoryService, FileUploadService
```

O projeto segue o padrão **Controller → Service → Eloquent**: controllers são finos e delegam lógica de negócio para services. Dados expostos pela API passam por API Resources para serialização consistente.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para rodar `npm` no host, se preferir)

## Setup

### 1. Clone e configure o ambiente

```bash
git clone <url-do-repo>
cd devhub
cp .env.example .env
```

Edite o `.env` e confirme as variáveis do banco:

```env
DB_HOST=db
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=user
DB_PASSWORD=secret
```

### 2. Suba os containers

```bash
docker compose up -d
```

### 3. Instale dependências e prepare o banco

```bash
docker exec app composer install
docker exec app php artisan key:generate
docker exec app php artisan migrate
docker exec app npm install
docker exec app npm run build
```

### 4. (Opcional) Popule com dados de exemplo

```bash
docker exec app php artisan db:seed
```

Isso cria 6 categorias e 6 posts de exemplo, além de um usuário admin.

### 5. Configure o host local

Adicione ao seu `/etc/hosts`:

```
127.0.0.1   devhub.local
```

Acesse em **http://devhub.local**

## Containers

| Container | Função | Porta |
|-----------|--------|-------|
| `app` | PHP-FPM (Laravel) | — |
| `webserver` | Nginx | 80 |
| `db` | MySQL 8 | 3307 (host) |

## Comandos úteis

```bash
# Rodar migrations
docker exec app php artisan migrate

# Acessar o banco pelo host
mysql -h 127.0.0.1 -P 3307 -u user -psecret app_db

# Build dos assets
docker exec app npm run build

# Rodar em modo desenvolvimento (com hot reload)
docker exec app npm run dev
```

## API

A API requer um token Bearer no header `Authorization`. Tokens são gerenciados pelo painel administrativo em `/admin`.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/posts` | Lista posts ativos (paginado) |
| `GET` | `/api/posts/{slug}` | Retorna um post pelo slug |

**Exemplo:**

```bash
curl -H "Authorization: Bearer SEU_TOKEN" http://devhub.local/api/posts
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Título do post",
      "slug": "titulo-do-post",
      "description": "...",
      "banner_image": "http://devhub.local/storage/...",
      "published_at": "2026-05-16T00:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 6
  }
}
```

## Testes

Os testes usam SQLite in-memory e não afetam o banco de desenvolvimento.

```bash
docker exec app php artisan test
```

Os testes cobrem:

- Endpoints da API (autenticação, listagem, filtro de posts inativos, busca por slug)
- Rotas de autenticação (login, registro, logout)
- Perfil do usuário (atualização, exclusão)

## Variáveis de ambiente relevantes

| Variável | Descrição |
|----------|-----------|
| `APP_URL` | URL base da aplicação |
| `DB_*` | Conexão com MySQL |
| `FILESYSTEM_DISK` | Disco para upload de arquivos (padrão: `public`) |
