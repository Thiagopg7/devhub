# DevHub

[![CI](https://github.com/Thiagopg7/devhub/actions/workflows/ci.yml/badge.svg)](https://github.com/Thiagopg7/devhub/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-%E2%89%A570%25-success)
![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)

CMS full-stack construído do zero com Laravel 13 + React 18 — painel administrativo completo, API RESTful autenticada com Sanctum, sistema de newsletter com conformidade LGPD, agenda de eventos, depoimentos e um frontend público dinâmico com tema claro/escuro.

> **Demo ao vivo:** [devhub-production-a6a5.up.railway.app](https://devhub-production-a6a5.up.railway.app) · **Admin:** [/admin](https://devhub-production-a6a5.up.railway.app/admin) (credenciais: `demo@devhub.com` / `Demo@123` — acesso somente leitura)

![Frontend público do DevHub](docs/gifs/frontend.gif)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | PHP 8.3 + Laravel 13 |
| Frontend | React 18 + Inertia.js |
| Editor de texto | TipTap |
| Estilização | Tailwind CSS 3 |
| Build | Vite 8 |
| Banco de dados | MySQL 8 |
| Cache / Queue broker | Redis |
| Autenticação API | Laravel Sanctum |
| Filas assíncronas | Laravel Queue (driver: database) |
| Infra | Docker + Nginx |
| Deploy | Railway |

## Funcionalidades

### Frontend público
- Homepage modular: hero com estatísticas, post em destaque, explorador de posts, marquee de stack, carrossel de tecnologias, próximos eventos e depoimentos
- Página individual de post com prose rendering, barra de progresso de leitura, botões de compartilhamento e navegação entre posts
- Listagem de posts por categoria (roteamento dinâmico por slug)
- Agenda de eventos (`/agenda`) com filtros por status, datas, CTAs e indicação de vagas
- Página institucional "Sobre" (`/sobre`) com estatísticas e trilhas por categoria
- Vitrine pública de tecnologias (`/tecnologias`)
- Tema claro/escuro alternável, persistido no cliente
- Menu de navegação dinâmico com suporte a submenus
- `sitemap.xml` gerado dinamicamente
- Banner de privacidade (LGPD)
- Formulário de newsletter com consentimento explícito (LGPD)

### Painel administrativo
- **Posts** — CRUD completo com editor rich-text (TipTap), upload de banner, slug automático, agendamento de publicação, destaque na home e toggle ativo/inativo
- **Páginas** — CRUD de páginas estáticas com imagem principal, galeria de fotos e campos de SEO
- **Categorias** — CRUD com cor e ícone customizáveis
- **Blocos de conteúdo** — trechos de HTML reutilizáveis identificados por slug
- **Tecnologias** — vitrine de ferramentas com ícone, screenshot e link, reordenáveis
- **Eventos** — agenda com tipo, data/hora, formato (online/presencial), status, CTA e controle de vagas, com filtros por período/tipo/status
- **Depoimentos** — testemunhos com avatar, cargo e empresa, reordenáveis
- **Stack** — itens de tecnologia exibidos no marquee da home, reordenáveis
- **Menu** — gerenciamento de itens de navegação com suporte a hierarquia pai/filho e reordenação
- **Configurações** — painel centralizado para nome do site, tagline, redes sociais, contato e scripts de terceiros
- **Newsletter** — áreas temáticas, inscritos com consentimento LGPD e campanhas de e-mail
- **Permissões e Papéis** — controle de acesso baseado em papéis (via Spatie Laravel Permission)
- **Usuários** — gerenciamento de usuários e atribuição de papéis
- **Lixeira** — soft delete em posts, categorias e páginas, com restauração ou exclusão definitiva e registro de quem excluiu
- **Log de atividades** — histórico de ações com diff de alterações (via Spatie Activity Log)

### Sistema de Newsletter
- Inscrição com consentimento explícito: checkbox obrigatório (não pré-marcado), finalidade clara no formulário
- Consentimento armazenado com timestamp (LGPD)
- Link de descadastro funcional por token único em todos os e-mails
- Campanhas vinculadas a posts do blog — o admin seleciona quais posts compõem cada edição
- Envio assíncrono via Laravel Queue com log individual por inscrito
- Agendamento de campanhas com scheduler automático
- Poda automática de logs após 6 meses (minimização de dados — LGPD)

### API RESTful
- Autenticação via Bearer token (Laravel Sanctum)
- Documentação Swagger UI disponível em `/api/docs`
- Cache Redis em todos os endpoints com invalidação automática por tags (model events)
- Rate limiting: `60 req/min` nos endpoints autenticados, `10 req/min` no login, `30 req/min` no health check e `5 req/h` na inscrição de newsletter

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Autenticação e geração de token |
| `POST` | `/api/auth/logout` | Revogação do token |
| `GET` | `/api/auth/me` | Dados do usuário autenticado |
| `GET` | `/api/posts` | Lista posts ativos (paginado) |
| `GET` | `/api/posts/{slug}` | Retorna um post pelo slug |
| `GET` | `/api/categories` | Lista categorias |
| `GET` | `/api/categories/{slug}` | Retorna uma categoria pelo slug |
| `GET` | `/api/pages` | Lista páginas |
| `GET` | `/api/pages/{slug}` | Retorna uma página |
| `GET` | `/api/menu` | Estrutura do menu |
| `GET` | `/api/technologies` | Lista tecnologias ativas (ordenadas) |
| `GET` | `/api/events` | Lista eventos |
| `GET` | `/api/testimonials` | Lista depoimentos |
| `GET` | `/api/stack` | Lista itens de stack |
| `GET` | `/api/config` | Configurações públicas do site |
| `POST` | `/api/newsletter` | Inscrição na newsletter — público, com rate limit |
| `GET` | `/api/health` | Health check (DB + cache) — público, sem autenticação |

## Arquitetura

```
app/
├── Console/Commands/
│   ├── DispatchScheduledNewsletters.php  # Verifica campanhas agendadas (roda a cada minuto)
│   └── GenerateApiToken.php
├── Http/
│   ├── Controllers/
│   │   ├── Admin/        # 21 controllers (Posts, Pages, Categories, Blocks,
│   │   │                 # Technologies, Events, Testimonials, StackItems,
│   │   │                 # Menu, Configs, Users, Roles, NewsletterAreas,
│   │   │                 # NewsletterSubscribers, NewsletterCampaigns,
│   │   │                 # ActivityLog, Gallery, Reorder, Toggle…)
│   │   ├── Api/          # Auth, Post, Category, Page, Menu, Technology,
│   │   │                 # Event, Testimonial, Stack, Config, Health
│   │   └── Home, Blog, Sobre, Agenda, Newsletter, Sitemap, Technology
│   ├── Middleware/
│   │   ├── EnsureAdmin.php
│   │   └── ResourcePermission.php
│   └── Requests/         # Form Requests por recurso
├── Jobs/
│   └── SendNewsletterCampaign.php   # Processamento assíncrono de campanhas
├── Mail/
│   └── NewsletterCampaignMail.php
├── Models/               # Post, Page, GalleryImage, Category, Block, Technology,
│                         # Event, Testimonial, StackItem, MenuItem, Config,
│                         # User, Role, NewsletterArea, NewsletterSubscriber,
│                         # NewsletterCampaign, NewsletterSendLog
├── Services/             # PostService, PageService, TechnologyService,
│                         # TestimonialService, MenuService, RoleService,
│                         # UserService, ConfigService, ActivityLogService,
│                         # FileUploadService
└── Traits/
    └── HasActivityLog.php
```

O projeto segue o padrão **Controller → Service → Eloquent**: controllers são finos e delegam lógica de negócio para services. CRUD simples usa Eloquent direto no controller. Dados da API passam por Resources para serialização consistente.

## Decisões técnicas

**Service layer em vez de Repository pattern**
O Repository pattern adiciona uma camada de abstração que só se justifica quando você precisa trocar o mecanismo de persistência. Aqui, o banco é MySQL e o ORM é Eloquent — fixos. A camada de Service existe apenas onde há lógica de negócio genuína: orquestração de múltiplos models, transações, upload de arquivos.

**Inertia.js em vez de API + SPA separado**
O painel administrativo não precisa de uma API própria — é uma interface que consome os mesmos dados do backend. Inertia.js permite escrever o frontend em React com roteamento e estado gerenciados pelo Laravel, sem duplicar a camada de autenticação e autorização. A API RESTful existe separada para consumo externo.

**Sanctum para autenticação da API**
Tokens stateless gerados pelo próprio Laravel, sem dependência de pacote externo de JWT. O `personal_access_tokens` do Sanctum integra com o ecossistema Laravel nativamente e suporta revogação individual de tokens.

**Queue assíncrona para campanhas de newsletter**
O envio de e-mails para múltiplos inscritos é feito via Job enfileirado (Laravel Queue, driver `database`), evitando timeout na requisição HTTP e possibilitando retry automático em caso de falha. O worker roda em background no mesmo container via `start.sh`.

**Spatie Permission e Activity Log**
Controle de acesso baseado em papéis (RBAC) e log de auditoria são problemas resolvidos. Os pacotes Spatie são padrão de mercado em projetos Laravel.

**Soft delete com lixeira e autoria**
Posts, categorias e páginas usam soft delete em vez de remoção física: a exclusão move o registro para uma lixeira de onde ele pode ser restaurado ou apagado em definitivo. Cada exclusão grava quem a fez (`deleted_by`), dando rastreabilidade sem depender só do log de atividades. Evita perda acidental de conteúdo — importante num CMS.

**Redis para cache da API**
Todos os endpoints da API têm a resposta cacheada no Redis usando `Cache::tags` — uma tag por recurso (posts, categories, menu, pages, technologies). A invalidação é automática via model events (`saved`/`deleted`): a cada create/update/delete, o cache da tag afetada é limpo. Dependências cruzadas são tratadas (ex.: salvar um post invalida `posts` e `categories`, pois a contagem de posts e a categoria embutida mudam; alterar uma imagem de galeria invalida `pages`). Reordenações feitas via `DB::table` — que não disparam events — invalidam as tags explicitamente no `ReorderController`. Cacheamos apenas o array já serializado pelo Resource, nunca models Eloquent. TTL de 1h como rede de segurança.

**SQLite in-memory para testes**
Os testes de feature cobrem comportamento de rotas e regras de negócio, não detalhes de SQL. SQLite in-memory elimina a dependência de banco real, torna os testes rápidos e garante isolamento entre suítes.

## Screenshots

### Frontend público
![Homepage](docs/screenshots/homepage.png)
*Homepage com hero, post em destaque, explorador de posts, eventos e depoimentos*

![Post individual](docs/screenshots/post.png)
*Página de post com rich-text e metadados*

![Agenda de eventos](docs/screenshots/agenda.png)
*Agenda de eventos com filtros por status, datas, CTAs e indicação de vagas*

![Página Sobre](docs/screenshots/sobre.png)
*Página institucional com estatísticas e trilhas de conteúdo*

### Painel administrativo

![Dashboard](docs/screenshots/dashboard.png)
*Dashboard com métricas, gráfico de posts dos últimos 6 meses e feed de atividade recente*

![Tema claro/escuro](docs/gifs/theme-toggle.gif)
*Alternância de tema claro/escuro persistida no cliente*

![Posts](docs/screenshots/posts-list.png)
*Listagem de posts com imagem de capa, toggle ativo/inativo e busca*

![Editor de post](docs/screenshots/post-editor.png)
*Edição de post com editor rich-text (TipTap), categoria, descrição e SEO*

![Eventos](docs/screenshots/events-list.png)
*Gerenciamento de eventos com filtros por período, tipo e status*

![Lixeira](docs/screenshots/posts-trashed.png)
*Lixeira (soft delete) com restauração, exclusão definitiva e registro de quem excluiu*

![Papéis e permissões](docs/screenshots/roles-permissions.png)
*Controle de acesso por papéis (RBAC) — permissões por módulo e ação*

![Log de atividades](docs/screenshots/activity-log.png)
*Log de auditoria com filtros e diff (antes/depois) de cada alteração*

![Login](docs/screenshots/login.png)
*Tela de login com acesso de demonstração*

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
- Usuário admin (`admin@teste.com.br` / `Senha@123`) e usuário demo somente-leitura (`demo@devhub.com` / `Demo@123`)
- Papéis e permissões (RBAC)
- Categorias e posts com imagens
- Páginas "Sobre Nós" e "Política de Privacidade"
- Tecnologias, itens de stack, depoimentos e eventos
- Áreas de newsletter, configurações do site e menu de navegação completo

> As senhas do seed podem ser sobrescritas por variáveis de ambiente (`SEED_*`); sem elas, valem os padrões de desenvolvimento acima.

### 6. Configure o host local

Adicione ao seu `/etc/hosts`:

```
127.0.0.1   devhub.local
```

Acesse em **http://devhub.local** e o painel em **http://devhub.local/admin**

### 7. (Opcional) Inicie filas e scheduler para o sistema de newsletter

```bash
# Queue worker — processa campanhas de e-mail
docker exec app php artisan queue:work

# Scheduler — despacha campanhas agendadas a cada minuto
php artisan schedule:work   # roda no host
```

## Containers

| Container | Função | Porta |
|-----------|--------|-------|
| `app` | PHP-FPM (Laravel) | — |
| `webserver` | Nginx | 80 |
| `db` | MySQL 8 | 3307 (host) |
| `redis` | Cache + Queue | 6379 (host) |

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

## Testes

Os testes usam SQLite in-memory e não afetam o banco de desenvolvimento.

```bash
docker exec app php artisan test
```

**Resultado atual: 420 testes, 1693 asserções — 100% passando**

Cobertura por módulo:

| Módulo | Testes |
|--------|--------|
| API | Auth, Posts, Categories, Pages, Menu, Technologies, Events, Testimonials, Stack, Config, Health, Newsletter e validação de token |
| Admin — Posts | CRUD completo, upload de banner, agendamento, soft delete e permissões |
| Admin — Categories, Blocks, Pages, Technologies | CRUD, upload de imagens e permissões |
| Admin — Events, Testimonials, Stack | CRUD, filtros, reordenação e permissões |
| Admin — Menu | CRUD e reordenação |
| Admin — Newsletter areas, subscribers e campanhas | CRUD, conformidade e envio |
| Admin — Roles e Users | Criação, proteção de perfis de sistema, controle de super admin |
| Admin — Reorder e Toggle | Transações, validação de módulos e ativação |
| Admin — ImageDelete | Remoção de imagens avulsas em Posts, Pages e Technologies |
| Público | Home, Blog, Agenda, Sobre, Tecnologias, Stack e Sitemap |
| Auth | Login, registro, reset de senha, verificação de e-mail |
| Perfil | Atualização e exclusão de conta |
| Models | Limpeza de arquivos em Posts, Pages e GalleryImages |
| Services | PostService, PageService, TechnologyService, MenuService, ConfigService e UserService |
| Console / Jobs | Despacho de newsletters agendadas e envio assíncrono de campanhas |

## Variáveis de ambiente relevantes

| Variável | Descrição |
|----------|-----------|
| `APP_URL` | URL base da aplicação |
| `DB_*` | Conexão com MySQL |
| `REDIS_URL` | Conexão com Redis (cache e filas) |
| `CACHE_STORE` | Driver de cache (`redis` em produção) |
| `QUEUE_CONNECTION` | Driver de fila (`database` em produção) |
| `MAIL_*` | Configuração SMTP para envio de newsletters |
| `FILESYSTEM_DISK` | Disco para upload de arquivos (padrão: `public`) |
| `SEED_*` | Credenciais dos usuários criados pelo seeder (admin e demo) |
