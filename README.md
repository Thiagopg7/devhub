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

### Frontend público
- Homepage com posts em destaque e listagem paginada
- Página individual de post com prose rendering
- Listagem de posts por categoria
- Menu de navegação dinâmico com suporte a submenus
- Banner de privacidade (LGPD)

### Painel administrativo
- **Posts** — CRUD completo com editor rich-text (TipTap), upload de banner, slug automático, toggle ativo/inativo
- **Páginas** — CRUD de páginas estáticas com banner, imagem principal, galeria de fotos e campos de SEO
- **Categorias** — CRUD com cor customizável
- **Blocos de conteúdo** — trechos de HTML reutilizáveis identificados por slug
- **Tecnologias** — vitrine de ferramentas com ícone, screenshot e link
- **Menu** — gerenciamento de itens de navegação com suporte a hierarquia pai/filho e reordenação via drag-and-drop
- **Configurações** — painel centralizado para nome do site, tagline, redes sociais, contato e scripts de terceiros
- **Newsletter** — gerenciamento de áreas temáticas e lista de inscritos
- **Permissões e Papéis** — controle de acesso baseado em papéis (via Spatie Laravel Permission)
- **Usuários** — gerenciamento de usuários e atribuição de papéis
- **Log de atividades** — histórico de ações dos usuários com diff de alterações (via Spatie Activity Log)

### API RESTful
- Endpoints autenticados via token Bearer para consulta de posts

## Arquitetura

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/       # PostController, PageController, CategoryController,
│   │   │                # BlockController, TechnologyController, MenuController,
│   │   │                # ConfigController, UserController, RoleController,
│   │   │                # NewsletterAreaController, NewsletterSubscriberController,
│   │   │                # ActivityLogController, GalleryImageController,
│   │   │                # ToggleController, ReorderController
│   │   ├── Api/         # PostController (API pública)
│   │   └── BlogController, HomeController, NewsletterController
│   ├── Middleware/
│   │   ├── ValidateApiToken.php
│   │   └── EnsureIsAdmin.php
│   ├── Requests/        # Form Requests com validação por recurso
│   └── Resources/
│       └── PostResource.php
├── Models/              # Post, Page, GalleryImage, Category, Block, Technology,
│                        # MenuItem, Config, User, Role, ApiToken,
│                        # NewsletterArea, NewsletterSubscriber
├── Services/            # PostService, PageService, MenuService, RoleService,
│                        # UserService, ConfigService, ActivityLogService,
│                        # FileUploadService
└── Traits/
    └── HasActivityLog.php
```

O projeto segue o padrão **Controller → Service → Eloquent**: controllers são finos e delegam lógica de negócio para services. CRUD simples usa Eloquent direto no controller. Dados da API passam por Resources para serialização consistente.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 22.12+ no host (o container `app` não tem Node — o Vite roda no host)
  - Use `nvm use 22` se tiver o NVM instalado

## Setup

### 1. Clone e configure o ambiente

```bash
git clone <url-do-repo>
cd devhub
cp .env.example .env
```

Confirme as variáveis do banco no `.env`:

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

### 3. Instale dependências PHP e prepare o banco

```bash
docker exec app composer install
docker exec app php artisan key:generate
docker exec app php artisan migrate
docker exec app php artisan storage:link
```

### 4. Instale dependências Node e gere os assets

```bash
# Rodar no host (não no container)
nvm use 22
npm install
npm run build
```

### 5. (Opcional) Popule com dados de exemplo

```bash
docker exec app php artisan db:seed
```

Isso cria:
- 1 usuário admin (`thiago@teste.com.br` / `Senha@123`)
- 6 categorias e 6 posts com imagens
- Páginas "Sobre Nós" (com galeria) e "Política de Privacidade"
- 8 tecnologias e 8 áreas de newsletter
- Configurações do site e menu de navegação completo

### 6. Configure o host local

Adicione ao seu `/etc/hosts`:

```
127.0.0.1   devhub.local
```

Acesse em **http://devhub.local** e o painel em **http://devhub.local/admin**

## Containers

| Container | Função | Porta |
|-----------|--------|-------|
| `app` | PHP-FPM (Laravel) | — |
| `webserver` | Nginx | 80 |
| `db` | MySQL 8 | 3307 (host) |

## Comandos úteis

```bash
# Migrations
docker exec app php artisan migrate

# Acessar o banco pelo host
mysql -h 127.0.0.1 -P 3307 -u user -psecret app_db

# Frontend — dev server com hot reload (rodar no host)
nvm use 22
npm run dev

# Frontend — build de produção (rodar no host)
npm run build

# Rodar testes
docker exec app php artisan test
```

## API

A API requer um token Bearer no header `Authorization`. Tokens são gerenciados pelo painel em `/admin`.

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

Cobertura atual:

- Endpoints da API (autenticação, listagem, filtro de posts inativos, busca por slug)
- Rotas de autenticação (login, registro, logout)
- Perfil do usuário (atualização, exclusão)

## Variáveis de ambiente relevantes

| Variável | Descrição |
|----------|-----------|
| `APP_URL` | URL base da aplicação |
| `DB_*` | Conexão com MySQL |
| `FILESYSTEM_DISK` | Disco para upload de arquivos (padrão: `public`) |
