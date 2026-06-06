<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Database\Seeders\Support\PostCover;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /** Primeira publicação (sexta). Cada post sai +1 semana; o último cai em 25/12/2026. */
    private const START = '2026-05-08 09:00:00';

    public function run(): void
    {
        $user = User::first();

        $categories = Category::pluck('id', 'slug');
        $colors = Category::pluck('color', 'slug');
        $names = Category::pluck('name', 'slug');

        $start = Carbon::parse(self::START);

        foreach ($this->posts() as $i => $data) {
            $slug = Str::slug($data['title']);
            $categorySlug = $data['category'];

            $cover = "posts/covers/{$slug}.svg";
            if (! Storage::disk('public')->exists($cover)) {
                Storage::disk('public')->put($cover, PostCover::svg(
                    $data['title'],
                    $names[$categorySlug] ?? 'DevHub',
                    $colors[$categorySlug] ?? '#3CBDF8'
                ));
            }

            $post = Post::firstOrCreate(
                ['title' => $data['title']],
                [
                    'user_id' => $user?->id,
                    'category_id' => $categories[$categorySlug] ?? null,
                    'slug' => $slug,
                    'description' => $data['description'],
                    'content' => $this->article($data),
                    'banner_image' => $cover,
                    'meta_title' => $data['meta_title'] ?? $data['title'],
                    'meta_description' => $data['meta_description'] ?? $data['description'],
                    'is_active' => true,
                    'is_featured' => $data['featured'] ?? false,
                    'published_at' => $start->copy()->addWeeks($i),
                ]
            );

            // storage efêmero: garante a capa mesmo em posts já existentes sem banner
            if (! $post->banner_image) {
                $post->update(['banner_image' => $cover]);
            }
        }
    }

    /** Monta o HTML do artigo a partir das partes estruturadas. */
    private function article(array $d): string
    {
        $html = '<p>'.$d['intro'].'</p>';

        foreach ($d['sections'] as $section) {
            $html .= '<h2>'.$section['h'].'</h2>';
            foreach ((array) $section['p'] as $paragraph) {
                $html .= '<p>'.$paragraph.'</p>';
            }
            if (! empty($section['ul'])) {
                $html .= '<ul>';
                foreach ($section['ul'] as $item) {
                    $html .= '<li>'.$item.'</li>';
                }
                $html .= '</ul>';
            }
        }

        if (! empty($d['tip'])) {
            $html .= '<blockquote>'.$d['tip'].'</blockquote>';
        }

        $html .= '<h2>Conclusão</h2><p>'.$d['outro'].'</p>';

        if (! empty($d['sources'])) {
            $html .= '<h3>Fontes e leitura recomendada</h3><ul>';
            foreach ($d['sources'] as $src) {
                $html .= '<li><a href="'.$src['url'].'" target="_blank" rel="noopener noreferrer">'.$src['label'].'</a></li>';
            }
            $html .= '</ul>';
        }

        return $html;
    }

    private function posts(): array
    {
        return [
            // ───────────────────────── Desenvolvimento Web ─────────────────────────
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Começando com Laravel: do zero ao primeiro CRUD',
                'description' => 'Um guia prático para entrar no ecossistema Laravel e construir sua primeira aplicação com rotas, controllers e Eloquent.',
                'meta_title' => 'Começando com Laravel — Guia Prático de CRUD',
                'intro' => 'Laravel é um framework PHP que prioriza a experiência do desenvolvedor. Neste guia você vai construir um CRUD completo e entender as peças que se encaixam por trás de qualquer aplicação Laravel.',
                'sections' => [
                    ['h' => 'O fluxo de uma requisição', 'p' => 'Toda requisição passa por uma rota, que aponta para um controller. O controller orquestra a lógica e devolve uma resposta — geralmente uma view ou um JSON. Entender esse caminho é o primeiro passo para dominar o framework.'],
                    ['h' => 'Migrations, Model e Eloquent', 'p' => 'As migrations versionam o esquema do banco como código. O Model representa a tabela e, via Eloquent, você cria, lê, atualiza e remove registros com uma sintaxe expressiva.', 'ul' => ['<code>php artisan make:model Post -mcr</code> gera model, migration e controller de uma vez', 'Use <code>$fillable</code> para liberar atribuição em massa com segurança', 'Prefira Form Requests para validar a entrada']],
                ],
                'tip' => 'Comece pequeno: um CRUD bem feito ensina mais do que dez tutoriais assistidos sem colocar a mão no código.',
                'outro' => 'Com rotas, controllers e Eloquent você já tem a base de praticamente qualquer aplicação Laravel. O próximo passo é adicionar validação, autenticação e testes.',
                'sources' => [['label' => 'Documentação oficial do Laravel', 'url' => 'https://laravel.com/docs']],
                'featured' => true,
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'React com Inertia.js: SPA sem API REST',
                'description' => 'Como o Inertia.js une o melhor do React com o back-end Laravel, eliminando a necessidade de uma API separada.',
                'intro' => 'O Inertia.js permite construir SPAs modernas usando seu framework back-end favorito como roteador, sem manter uma API REST dedicada.',
                'sections' => [
                    ['h' => 'O modelo mental do Inertia', 'p' => 'Em vez de retornar JSON e montar rotas no front, o controller retorna uma "página" Inertia com props. O React renderiza essa página como um componente, e a navegação acontece via XHR sem recarregar o documento.'],
                    ['h' => 'Quando faz sentido', 'p' => 'Inertia brilha em aplicações que seriam um monólito Blade, mas que você quer com a interatividade do React. Para APIs públicas consumidas por terceiros, uma API REST ou GraphQL ainda é o caminho.'],
                ],
                'tip' => 'Inertia não é um framework — é a cola entre seu back-end e seu front-end. Você continua escrevendo Laravel e React normais.',
                'outro' => 'Se o seu objetivo é produtividade num time full-stack, o Inertia remove muita cerimônia. Vale o experimento no próximo projeto.',
                'sources' => [['label' => 'Site oficial do Inertia.js', 'url' => 'https://inertiajs.com']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Hooks essenciais do React: useState, useEffect e useMemo',
                'description' => 'Os três hooks que sustentam a maioria dos componentes React e como evitar as armadilhas mais comuns.',
                'intro' => 'Hooks transformaram a forma de escrever React. Dominar três deles já resolve a grande maioria dos casos do dia a dia.',
                'sections' => [
                    ['h' => 'Estado e efeitos', 'p' => 'O <code>useState</code> guarda valores que mudam ao longo do tempo; o <code>useEffect</code> sincroniza o componente com o mundo externo (rede, timers, DOM). O segredo do useEffect está no array de dependências — ele decide quando o efeito roda de novo.'],
                    ['h' => 'Memorização com cuidado', 'p' => 'O <code>useMemo</code> evita recalcular valores caros a cada render. Mas memorizar tudo é contraproducente: só vale quando há custo real ou quando a referência precisa ser estável.'],
                ],
                'tip' => 'Dependências erradas no useEffect causam loops infinitos ou dados desatualizados. Quando em dúvida, confie no linter de hooks.',
                'outro' => 'useState, useEffect e useMemo cobrem quase tudo. A partir deles, useCallback e useReducer entram naturalmente quando a complexidade cresce.',
                'sources' => [['label' => 'React — Documentação oficial', 'url' => 'https://react.dev/reference/react']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Eloquent: relacionamentos que todo dev Laravel deveria dominar',
                'description' => 'hasMany, belongsTo, belongsToMany e morphMany explicados com exemplos práticos.',
                'intro' => 'Os relacionamentos do Eloquent traduzem as relações entre tabelas para um código limpo e legível. Conhecê-los bem é o que separa um CRUD ingênuo de uma aplicação robusta.',
                'sections' => [
                    ['h' => 'Os relacionamentos básicos', 'p' => 'A maioria das aplicações vive de três tipos: um-para-muitos, muitos-para-muitos e o inverso (belongsTo). Defini-los no model dá acesso a queries expressivas e a métodos de criação encadeados.', 'ul' => ['<code>hasMany</code> / <code>belongsTo</code> — um post pertence a uma categoria', '<code>belongsToMany</code> — tabela pivô entre dois models', '<code>morphMany</code> — relacionamentos polimórficos (comentários em vários tipos)']],
                    ['h' => 'Cuidado com o N+1', 'p' => 'Acessar relacionamentos dentro de um loop sem eager loading dispara uma query por item. Use <code>with()</code> para carregar tudo de uma vez.'],
                ],
                'tip' => 'Ative o <code>Model::preventLazyLoading()</code> em desenvolvimento para que o N+1 estoure como exceção em vez de passar despercebido.',
                'outro' => 'Relacionamentos bem definidos deixam o código mais declarativo e o banco mais saudável. Invista tempo aqui — o retorno é enorme.',
                'sources' => [['label' => 'Eloquent Relationships — Laravel', 'url' => 'https://laravel.com/docs/eloquent-relationships']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Validação no Laravel com Form Requests',
                'description' => 'Tire as regras de validação do controller e ganhe código mais limpo, reutilizável e testável.',
                'intro' => 'Validar entrada é inegociável. O Laravel oferece os Form Requests para isolar essas regras em classes dedicadas, deixando o controller enxuto.',
                'sections' => [
                    ['h' => 'Por que sair do controller', 'p' => 'Validar dentro do controller funciona, mas espalha regras e dificulta o reúso. Um Form Request centraliza autorização e regras num único lugar, e o Laravel injeta tudo automaticamente.'],
                    ['h' => 'Além do required', 'p' => 'Valide tipos e formatos, não só presença: <code>integer</code>, <code>boolean</code>, <code>date</code>, <code>email</code>, regex e regras condicionais. Em updates, lembre do <code>Rule::unique()->ignore()</code> para evitar falsos positivos.'],
                ],
                'tip' => 'Use <code>prepareForValidation()</code> para normalizar a entrada (trim, casts, defaults) antes das regras rodarem.',
                'outro' => 'Form Requests deixam a validação testável e o controller focado em orquestração. É um daqueles ajustes que melhoram o projeto inteiro.',
                'sources' => [['label' => 'Form Request Validation — Laravel', 'url' => 'https://laravel.com/docs/validation#form-request-validation']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Tailwind CSS: utility-first na prática',
                'description' => 'Como estilizar rápido sem sair do HTML e quando extrair componentes para não repetir classes.',
                'intro' => 'O Tailwind troca o CSS tradicional por classes utilitárias aplicadas direto no markup. Parece estranho no começo, mas a produtividade conquista.',
                'sections' => [
                    ['h' => 'A filosofia utility-first', 'p' => 'Em vez de nomear classes semânticas e pular para um arquivo CSS, você compõe o estilo na própria marcação. Isso elimina a fadiga de inventar nomes e mantém estilo e estrutura juntos.'],
                    ['h' => 'Evitando a repetição', 'p' => 'Quando o mesmo conjunto de classes se repete, extraia um componente (React ou Blade) em vez de uma classe CSS. O componente encapsula tanto a marcação quanto o estilo.'],
                ],
                'tip' => 'Configure o tema (cores, espaçamentos, fontes) no <code>tailwind.config</code> para manter consistência em vez de usar valores arbitrários.',
                'outro' => 'Tailwind não é para todo mundo, mas para times que valorizam velocidade e consistência ele entrega muito. Dê uma chance honesta antes de julgar.',
                'sources' => [['label' => 'Tailwind CSS — Documentação', 'url' => 'https://tailwindcss.com/docs']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'APIs REST com Laravel Sanctum: autenticação por token',
                'description' => 'Proteja seus endpoints com tokens Bearer de forma simples usando o Sanctum.',
                'intro' => 'O Sanctum é a solução oficial e leve do Laravel para autenticar APIs e SPAs. Em poucos passos você protege seus endpoints com tokens.',
                'sections' => [
                    ['h' => 'Tokens para APIs', 'p' => 'Cada usuário pode gerar tokens com habilidades (abilities) específicas. O cliente envia o token no header Authorization, e o middleware <code>auth:sanctum</code> cuida do resto.'],
                    ['h' => 'SPA no mesmo domínio', 'p' => 'Para front-ends servidos pelo mesmo domínio, o Sanctum também oferece autenticação baseada em cookie com proteção CSRF — sem precisar gerenciar tokens manualmente.'],
                ],
                'tip' => 'Dê às tokens o menor escopo possível (abilities) e tenha uma rotina para revogar tokens vazados.',
                'outro' => 'Sanctum cobre a maioria dos cenários sem a complexidade do OAuth completo. Para o que ele se propõe, é difícil de superar.',
                'sources' => [['label' => 'Laravel Sanctum', 'url' => 'https://laravel.com/docs/sanctum']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Filas e jobs no Laravel: tarefas em segundo plano',
                'description' => 'Tire o trabalho pesado da requisição e devolva respostas rápidas usando o sistema de filas.',
                'intro' => 'Enviar e-mail, processar imagem ou chamar uma API externa não deveria travar a resposta ao usuário. As filas do Laravel resolvem isso elegantemente.',
                'sections' => [
                    ['h' => 'Despachando jobs', 'p' => 'Um job encapsula uma unidade de trabalho. Você o despacha com <code>dispatch()</code> e um worker o processa em segundo plano, deixando a requisição livre para responder na hora.'],
                    ['h' => 'Resiliência', 'p' => 'Configure tentativas e backoff para falhas temporárias, e monitore a fila de jobs que falharam. Idempotência é essencial: um job pode rodar mais de uma vez.'],
                ],
                'tip' => 'Em produção, rode os workers via Supervisor (ou equivalente) para reiniciá-los automaticamente caso caiam.',
                'outro' => 'Filas transformam a percepção de performance da aplicação. Tudo que não precisa ser síncrono deveria ser um job.',
                'sources' => [['label' => 'Queues — Laravel', 'url' => 'https://laravel.com/docs/queues']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Componentização no React: quando dividir um componente',
                'description' => 'Sinais de que um componente cresceu demais e estratégias para quebrá-lo sem complicar.',
                'intro' => 'Componentes pequenos são mais fáceis de entender, testar e reutilizar. Mas dividir cedo demais também atrapalha. Onde fica o equilíbrio?',
                'sections' => [
                    ['h' => 'Sinais de que é hora de dividir', 'p' => 'Quando um componente acumula múltiplas responsabilidades, tem dezenas de props ou exige rolar muito para ser lido, é hora de extrair partes com nomes claros.', 'ul' => ['Mais de uma razão para mudar', 'Lógica que se repete em outro lugar', 'JSX profundamente aninhado e difícil de seguir']],
                    ['h' => 'Composição em vez de configuração', 'p' => 'Prefira compor componentes via children a criar um componente com mil flags. A composição mantém cada peça simples e flexível.'],
                ],
                'tip' => 'Extraia hooks customizados para isolar lógica de estado reutilizável — eles deixam o componente focado na renderização.',
                'outro' => 'Divida quando a dor aparecer, não por antecipação. O objetivo é legibilidade, não contagem de arquivos.',
                'sources' => [['label' => 'Thinking in React', 'url' => 'https://react.dev/learn/thinking-in-react']],
            ],
            [
                'category' => 'desenvolvimento-web',
                'title' => 'Blade vs componentes: organizando suas views',
                'description' => 'Como aproveitar componentes Blade, slots e layouts para parar de repetir HTML.',
                'intro' => 'O Blade é simples, mas poderoso. Componentes e layouts evitam a duplicação de HTML e deixam as views fáceis de manter.',
                'sections' => [
                    ['h' => 'Layouts e seções', 'p' => 'Um layout base define a estrutura comum (cabeçalho, rodapé) e as páginas preenchem as lacunas. Isso centraliza mudanças globais num único arquivo.'],
                    ['h' => 'Componentes e slots', 'p' => 'Componentes Blade encapsulam pedaços reutilizáveis de UI com props e slots, aproximando o Blade da experiência de componentes que você tem no front-end moderno.'],
                ],
                'tip' => 'Componentes anônimos (apenas um arquivo .blade.php) resolvem a maioria dos casos sem precisar de classe.',
                'outro' => 'Tratar views como componentes reduz drasticamente a duplicação. Seu eu do futuro agradece.',
                'sources' => [['label' => 'Blade Components — Laravel', 'url' => 'https://laravel.com/docs/blade#components']],
            ],

            // ───────────────────────── DevOps ─────────────────────────
            [
                'category' => 'devops',
                'title' => 'Docker para desenvolvedores PHP: ambiente consistente em minutos',
                'description' => 'Monte um ambiente PHP com Docker e nunca mais sofra com o "funciona na minha máquina".',
                'intro' => 'Com Docker você define o ambiente da aplicação como código, garantindo que todo o time — e a produção — rode exatamente a mesma coisa.',
                'sections' => [
                    ['h' => 'Por que conteinerizar', 'p' => 'Diferenças de versão de PHP, extensões ausentes e configurações divergentes somem quando o ambiente é descrito num Dockerfile. O resultado: onboarding em minutos e zero surpresas.'],
                    ['h' => 'Os serviços essenciais', 'p' => 'Um projeto Laravel típico sobe três contêineres: PHP-FPM para a aplicação, Nginx como servidor web e um banco como MySQL ou PostgreSQL.'],
                ],
                'tip' => 'Use volumes para o código em desenvolvimento (hot reload) e copie o código na imagem em produção (imutável).',
                'outro' => 'Docker tem curva de aprendizado, mas paga o investimento na primeira vez que um novo dev sobe o projeto sem dor de cabeça.',
                'sources' => [['label' => 'Get started — Docker Docs', 'url' => 'https://docs.docker.com/get-started/']],
            ],
            [
                'category' => 'devops',
                'title' => 'Docker Compose: orquestrando múltiplos serviços',
                'description' => 'Suba aplicação, banco e cache com um único comando usando o docker-compose.yml.',
                'intro' => 'Quando a aplicação precisa de vários serviços, gerenciar contêineres na mão vira caos. O Docker Compose descreve tudo num arquivo declarativo.',
                'sections' => [
                    ['h' => 'Um arquivo, todo o ambiente', 'p' => 'No <code>docker-compose.yml</code> você define cada serviço, suas portas, volumes, variáveis de ambiente e dependências. Um <code>docker compose up</code> sobe o conjunto inteiro.'],
                    ['h' => 'Rede entre serviços', 'p' => 'O Compose cria uma rede onde os contêineres se enxergam pelo nome do serviço. A aplicação conecta no banco usando <code>db</code> como host, sem IPs fixos.'],
                ],
                'tip' => 'Use <code>depends_on</code> com healthcheck para garantir que o banco esteja pronto antes da aplicação tentar conectar.',
                'outro' => 'Compose é a porta de entrada natural para orquestração. Quando o projeto crescer, os conceitos migram bem para Kubernetes.',
                'sources' => [['label' => 'Docker Compose — Docs', 'url' => 'https://docs.docker.com/compose/']],
            ],
            [
                'category' => 'devops',
                'title' => 'CI/CD com GitHub Actions para projetos Laravel',
                'description' => 'Automatize testes e deploy a cada push com pipelines simples no GitHub Actions.',
                'intro' => 'Rodar testes manualmente antes de cada deploy não escala. Com GitHub Actions, cada push dispara seu pipeline automaticamente.',
                'sections' => [
                    ['h' => 'Integração contínua', 'p' => 'Um workflow instala dependências, prepara o banco de teste e roda a suíte a cada push e pull request. Bugs são pegos antes de chegar na main.'],
                    ['h' => 'Entrega contínua', 'p' => 'Com os testes verdes, o mesmo pipeline pode fazer o build de assets e disparar o deploy. Quanto mais automático, menos espaço para erro humano.'],
                ],
                'tip' => 'Guarde segredos (chaves, tokens) nos Secrets do repositório — nunca no YAML versionado.',
                'outro' => 'Um pipeline de CI/CD bem feito é uma rede de segurança que trabalha por você 24 horas por dia. Comece simples e evolua.',
                'sources' => [['label' => 'GitHub Actions — Documentação', 'url' => 'https://docs.github.com/actions']],
            ],
            [
                'category' => 'devops',
                'title' => 'Deploy de aplicações Laravel: checklist de produção',
                'description' => 'Os comandos e cuidados que não podem faltar ao colocar um Laravel no ar.',
                'intro' => 'Subir para produção é mais do que um git push. Alguns passos garantem performance e segurança no ambiente real.',
                'sections' => [
                    ['h' => 'Otimizações obrigatórias', 'p' => 'Em produção, cacheie configuração, rotas e views, e otimize o autoloader. Esses passos reduzem drasticamente o tempo de resposta.', 'ul' => ['<code>php artisan config:cache</code>', '<code>php artisan route:cache</code>', '<code>php artisan optimize</code>', '<code>composer install --optimize-autoloader --no-dev</code>']],
                    ['h' => 'Segurança e migrations', 'p' => 'Mantenha <code>APP_DEBUG=false</code>, rode <code>migrate --force</code> de forma controlada e garanta permissões corretas em <code>storage</code> e <code>bootstrap/cache</code>.'],
                ],
                'tip' => 'Automatize esse checklist no script de deploy. Passo manual é passo que um dia será esquecido.',
                'outro' => 'Um deploy previsível é um deploy tranquilo. Documente e automatize cada etapa até que apertar o botão seja entediante.',
                'sources' => [['label' => 'Deployment — Laravel', 'url' => 'https://laravel.com/docs/deployment']],
            ],
            [
                'category' => 'devops',
                'title' => 'Cache com Redis no Laravel: acelerando sua aplicação',
                'description' => 'Reduza a carga no banco e ganhe milissegundos preciosos com uma estratégia de cache.',
                'intro' => 'Nem todo dado precisa ser buscado no banco a cada requisição. O Redis guarda resultados em memória e devolve respostas quase instantâneas.',
                'sections' => [
                    ['h' => 'O padrão cache-aside', 'p' => 'Com <code>Cache::remember()</code> você tenta ler do cache; se não houver, busca no banco e guarda para as próximas vezes. Simples e eficaz para dados que mudam pouco.'],
                    ['h' => 'Invalidação é o difícil', 'p' => 'A parte complicada do cache é saber quando limpá-lo. Use tags ou eventos do model para invalidar exatamente o que mudou, evitando dados velhos.'],
                ],
                'tip' => 'Defina um TTL mesmo quando invalida por evento — é a sua rede de segurança contra cache preso por engano.',
                'outro' => 'Cache bem aplicado é um dos ganhos de performance mais baratos que existem. Mas trate a invalidação com o respeito que ela merece.',
                'sources' => [['label' => 'Cache — Laravel', 'url' => 'https://laravel.com/docs/cache'], ['label' => 'Redis', 'url' => 'https://redis.io/docs/']],
            ],

            // ───────────────────────── Banco de Dados ─────────────────────────
            [
                'category' => 'banco-de-dados',
                'title' => 'Migrations no Laravel: versionando seu banco de dados',
                'description' => 'Mantenha o esquema sincronizado entre ambientes e equipes tratando o banco como código.',
                'intro' => 'Migrations são a forma do Laravel versionar mudanças no banco como se fossem commits. Cada uma representa uma alteração atômica e reversível.',
                'sections' => [
                    ['h' => 'Esquema como código', 'p' => 'Em vez de aplicar ALTER TABLE na mão em cada ambiente, você descreve a mudança numa migration. Qualquer pessoa roda <code>migrate</code> e chega ao mesmo estado.'],
                    ['h' => 'Reversibilidade', 'p' => 'O método <code>down()</code> desfaz a mudança. Migrations bem escritas podem ser revertidas com segurança quando algo dá errado.'],
                ],
                'tip' => 'Nunca edite uma migration já aplicada em produção. Crie uma nova — o histórico precisa ser linear e confiável.',
                'outro' => 'Com migrations, "funciona na minha máquina" deixa de existir. O banco passa a fazer parte do seu controle de versão.',
                'sources' => [['label' => 'Migrations — Laravel', 'url' => 'https://laravel.com/docs/migrations']],
            ],
            [
                'category' => 'banco-de-dados',
                'title' => 'Índices em bancos relacionais: quando e por que usar',
                'description' => 'Entenda como índices aceleram leituras, o custo que impõem nas escritas e onde aplicá-los.',
                'intro' => 'Um índice é como o sumário de um livro: permite encontrar dados sem varrer a tabela inteira. Usado bem, transforma queries lentas em instantâneas.',
                'sections' => [
                    ['h' => 'Onde indexar', 'p' => 'Colunas usadas em <code>WHERE</code>, <code>JOIN</code> e <code>ORDER BY</code> frequentes são candidatas naturais. Chaves estrangeiras quase sempre merecem índice.'],
                    ['h' => 'O custo escondido', 'p' => 'Índices aceleram leitura mas tornam escritas mais lentas e ocupam espaço. Indexar tudo é tão ruim quanto não indexar nada — meça antes de decidir.'],
                ],
                'tip' => 'Use o <code>EXPLAIN</code> da sua query para confirmar que o índice está realmente sendo usado.',
                'outro' => 'Índices são a ferramenta mais poderosa contra lentidão de leitura. Aplique com critério, guiado por medições reais.',
                'sources' => [['label' => 'Using EXPLAIN — PostgreSQL', 'url' => 'https://www.postgresql.org/docs/current/using-explain.html']],
            ],
            [
                'category' => 'banco-de-dados',
                'title' => 'Resolvendo o problema N+1 com eager loading',
                'description' => 'O gargalo silencioso que multiplica queries e como eliminá-lo com with().',
                'intro' => 'O N+1 é um dos problemas de performance mais comuns — e mais fáceis de não perceber. Ele dispara uma query extra para cada item de uma lista.',
                'sections' => [
                    ['h' => 'Como ele aparece', 'p' => 'Você lista 50 posts e, no loop, acessa a categoria de cada um. São 1 query para os posts mais 50 para as categorias. A página funciona, mas escala terrivelmente.'],
                    ['h' => 'A cura: eager loading', 'p' => 'Carregar o relacionamento antecipadamente com <code>with(\'category\')</code> reduz tudo a duas queries, independentemente do número de itens.'],
                ],
                'tip' => 'Ative o <code>preventLazyLoading()</code> em ambiente local para que o N+1 vire exceção e seja pego durante o desenvolvimento.',
                'outro' => 'Eager loading é simples de aplicar e tem impacto enorme. Em listas, costuma ser a diferença entre uma página rápida e uma travada.',
                'sources' => [['label' => 'Eager Loading — Laravel', 'url' => 'https://laravel.com/docs/eloquent-relationships#eager-loading']],
            ],
            [
                'category' => 'banco-de-dados',
                'title' => 'Transações: garantindo consistência nos seus dados',
                'description' => 'Quando várias operações precisam acontecer juntas — ou não acontecer — use transações.',
                'intro' => 'Algumas operações só fazem sentido em conjunto: debitar de uma conta e creditar em outra, por exemplo. Transações garantem o "tudo ou nada".',
                'sections' => [
                    ['h' => 'Atomicidade na prática', 'p' => 'Dentro de <code>DB::transaction()</code>, se qualquer passo lança exceção, tudo é revertido automaticamente. O banco nunca fica num estado parcial e inconsistente.'],
                    ['h' => 'Mantenha-as curtas', 'p' => 'Evite I/O externo (chamadas de API, envio de e-mail) dentro de uma transação — isso prende locks e degrada a concorrência. Faça o trabalho pesado fora dela.'],
                ],
                'tip' => 'Não engula a exceção dentro da transação: deixe-a propagar para que o rollback aconteça de fato.',
                'outro' => 'Transações são a sua garantia de integridade em operações críticas. Onde há dinheiro, estoque ou contadores, elas são obrigatórias.',
                'sources' => [['label' => 'Database Transactions — Laravel', 'url' => 'https://laravel.com/docs/database#database-transactions']],
            ],
            [
                'category' => 'banco-de-dados',
                'title' => 'MySQL ou PostgreSQL: qual escolher?',
                'description' => 'Um comparativo honesto entre os dois bancos relacionais mais populares do mercado.',
                'intro' => 'MySQL e PostgreSQL dominam o mundo relacional. Ambos são excelentes — a escolha depende mais do contexto do que de uma suposta superioridade.',
                'sections' => [
                    ['h' => 'Pontos fortes', 'p' => 'O PostgreSQL se destaca em conformidade com padrões, tipos avançados (JSONB, arrays) e extensibilidade. O MySQL brilha em simplicidade, ampla adoção e ecossistema de hospedagem.'],
                    ['h' => 'Como decidir', 'p' => 'Para a maioria das aplicações, qualquer um serve. Escolha pelo que seu time conhece, pelo que sua infraestrutura suporta melhor e pelas necessidades específicas de tipos e consultas.'],
                ],
                'tip' => 'Não troque de banco por modismo. Migração tem custo real — só vale com um problema concreto a resolver.',
                'outro' => 'Não existe vencedor absoluto. Existe o banco certo para o seu problema, e ambos costumam estar à altura.',
                'sources' => [['label' => 'PostgreSQL — Documentação', 'url' => 'https://www.postgresql.org/docs/'], ['label' => 'MySQL — Documentação', 'url' => 'https://dev.mysql.com/doc/']],
            ],

            // ───────────────────────── Carreira ─────────────────────────
            [
                'category' => 'carreira',
                'title' => 'Portfólio para devs: o que realmente importa para recrutadores',
                'description' => 'O que incluir (e evitar) no portfólio para se destacar nas triagens técnicas.',
                'intro' => 'Um portfólio forte não precisa de dezenas de projetos. Dois ou três bem feitos valem mais que um repositório cheio de CRUDs abandonados.',
                'sections' => [
                    ['h' => 'Qualidade sobre quantidade', 'p' => 'Recrutadores técnicos olham README claro, deploy acessível, commits organizados e código legível. Um projeto que conta uma história completa impressiona mais que dez pela metade.'],
                    ['h' => 'Mostre decisões, não só código', 'p' => 'Explique por que você escolheu cada tecnologia e que problemas enfrentou. Demonstrar raciocínio vale tanto quanto o resultado final.'],
                ],
                'tip' => 'Tenha pelo menos um projeto no ar, acessível por link. Ver funcionando vale mil prints.',
                'outro' => 'Seu portfólio é a prova prática do que você sabe. Capriche em poucos projetos e documente cada um como se fosse o único.',
                'sources' => [['label' => 'About READMEs — GitHub', 'url' => 'https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes']],
            ],
            [
                'category' => 'carreira',
                'title' => 'Como se preparar para entrevistas técnicas',
                'description' => 'Estratégias para chegar confiante em entrevistas de código, system design e comportamental.',
                'intro' => 'Entrevistas técnicas avaliam mais do que conhecimento: avaliam como você pensa sob pressão. Preparo reduz a ansiedade e melhora o desempenho.',
                'sections' => [
                    ['h' => 'Pratique em voz alta', 'p' => 'Resolver problemas falando o raciocínio simula o cenário real. O entrevistador quer entender seu processo, não só ver a resposta pronta.'],
                    ['h' => 'Revise o fundamental', 'p' => 'Estruturas de dados, complexidade, fundamentos da sua stack e perguntas comportamentais no formato STAR cobrem a maior parte das entrevistas.'],
                ],
                'tip' => 'Quando travar, verbalize. "Estou pensando em duas abordagens..." vale mais que um silêncio constrangedor.',
                'outro' => 'Entrevista é habilidade treinável. Quanto mais você pratica, mais natural fica — e mais você mostra o profissional que realmente é.',
                'sources' => [['label' => 'Tech Interview Handbook', 'url' => 'https://www.techinterviewhandbook.org/']],
            ],
            [
                'category' => 'carreira',
                'title' => 'Júnior, pleno, sênior: o que muda em cada nível',
                'description' => 'Para além do tempo de casa: o que de fato distingue cada senioridade.',
                'intro' => 'Os níveis de senioridade não medem anos, e sim autonomia, impacto e escopo. Entender isso ajuda a direcionar seu crescimento.',
                'sections' => [
                    ['h' => 'Da execução à autonomia', 'p' => 'O júnior entrega tarefas bem definidas com apoio. O pleno resolve problemas com independência. O sênior define os problemas, antecipa riscos e eleva o time ao redor.'],
                    ['h' => 'Impacto além do código', 'p' => 'Conforme você sobe, comunicação, mentoria e visão de negócio pesam tanto quanto a habilidade técnica. Escrever bom código vira o mínimo, não o diferencial.'],
                ],
                'tip' => 'Quer crescer? Resolva problemas um nível acima do seu cargo atual — e ajude quem está um nível abaixo.',
                'outro' => 'Senioridade é sobre o tamanho do problema que você resolve sozinho e quanto eleva quem está ao seu lado. Foque nisso, não no calendário.',
                'sources' => [['label' => 'Levels.fyi', 'url' => 'https://www.levels.fyi/']],
            ],
            [
                'category' => 'carreira',
                'title' => 'Soft skills que aceleram a carreira de quem programa',
                'description' => 'Comunicação, colaboração e gestão de tempo costumam destravar mais do que mais uma linguagem.',
                'intro' => 'Habilidade técnica abre a porta, mas são as soft skills que determinam até onde você vai. Elas raramente aparecem no currículo, mas pesam todo dia.',
                'sections' => [
                    ['h' => 'Comunicação clara', 'p' => 'Saber explicar uma decisão técnica para quem não é técnico, escrever uma boa descrição de PR e documentar o suficiente economiza horas de todo mundo.'],
                    ['h' => 'Colaboração e empatia', 'p' => 'Code reviews construtivos, pedir ajuda na hora certa e dar feedback com respeito constroem times saudáveis — e times saudáveis entregam mais.'],
                ],
                'tip' => 'Trabalhe a escrita. Em times remotos, comunicação assíncrona bem feita é um superpoder.',
                'outro' => 'Invista em soft skills com a mesma seriedade que investe em código. Elas são o multiplicador da sua carreira.',
                'sources' => [['label' => 'Soft Skills — Atlassian', 'url' => 'https://www.atlassian.com/work-management/project-management/soft-skills']],
            ],
            [
                'category' => 'carreira',
                'title' => 'Contribuindo para open source: por onde começar',
                'description' => 'Um caminho prático para sua primeira contribuição sem medo do código alheio.',
                'intro' => 'Contribuir para open source acelera o aprendizado, expande sua rede e fortalece o portfólio. E começar é mais simples do que parece.',
                'sections' => [
                    ['h' => 'A primeira contribuição', 'p' => 'Comece pequeno: corrigir documentação, melhorar mensagens de erro ou pegar issues marcadas como "good first issue". O objetivo inicial é entender o fluxo, não resolver o problema mais difícil.'],
                    ['h' => 'Respeite o projeto', 'p' => 'Leia o guia de contribuição, siga o padrão de código e abra issues antes de PRs grandes. Mantenedores valorizam contribuições alinhadas e bem comunicadas.'],
                ],
                'tip' => 'Sua primeira PR não precisa ser código. Melhorar um README já é uma contribuição valiosa e bem-vinda.',
                'outro' => 'Open source é uma das melhores escolas que existem. Dê o primeiro passo — a comunidade costuma receber bem quem chega com humildade.',
                'sources' => [['label' => 'Open Source Guides', 'url' => 'https://opensource.guide/how-to-contribute/']],
            ],

            // ───────────────────────── Boas Práticas ─────────────────────────
            [
                'category' => 'boas-praticas',
                'title' => 'Service Layer no Laravel: separando responsabilidades',
                'description' => 'Por que e como tirar a lógica de negócio dos controllers para uma camada de serviços.',
                'intro' => 'Controllers gordos são um problema comum em projetos que crescem sem planejamento. A Service Layer resolve isso extraindo a lógica de negócio.',
                'sections' => [
                    ['h' => 'O papel de cada camada', 'p' => 'O controller recebe a requisição, delega e devolve a resposta. O service concentra as regras de negócio — orquestração de models, transações, invalidação de cache. Cada um com uma responsabilidade clara.'],
                    ['h' => 'Quando NÃO criar um service', 'p' => 'CRUD trivial não precisa de service só para envelopar um <code>Model::create()</code>. Crie a camada quando houver lógica de domínio real a isolar.'],
                ],
                'tip' => 'Regra prática: se há um if decidindo regra de negócio, ou é trivial e fica no controller, ou vai para o service.',
                'outro' => 'A Service Layer torna o código testável e organizado sem burocratizar o simples. Use com bom senso, não como dogma.',
                'sources' => [['label' => 'Controllers — Laravel', 'url' => 'https://laravel.com/docs/controllers']],
            ],
            [
                'category' => 'boas-praticas',
                'title' => 'Clean Code: nomes que revelam intenção',
                'description' => 'O nome certo é a documentação mais barata e eficaz que existe.',
                'intro' => 'Passamos muito mais tempo lendo código do que escrevendo. Nomes claros são o investimento de maior retorno na legibilidade.',
                'sections' => [
                    ['h' => 'Nomeie pela intenção', 'p' => 'Variáveis como <code>$data</code>, <code>$temp</code> e funções como <code>process()</code> escondem o propósito. Prefira nomes que respondam "o que é isto?" sem precisar ler a implementação.'],
                    ['h' => 'Consistência importa', 'p' => 'Use o mesmo vocabulário em todo o projeto. Se é <code>buscar</code> num lugar, não vire <code>obter</code> no outro. Padrões reduzem a carga mental de quem lê.'],
                ],
                'tip' => 'Se um comentário explica O QUE o código faz, geralmente o código pode ser reescrito para dispensar o comentário.',
                'outro' => 'Bons nomes transformam código complicado em código óbvio. É a prática de clean code com melhor custo-benefício.',
                'sources' => [['label' => 'Clean Code — Robert C. Martin', 'url' => 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/']],
            ],
            [
                'category' => 'boas-praticas',
                'title' => 'Testes automatizados no Laravel com Pest',
                'description' => 'Ganhe confiança para refatorar e evoluir sua aplicação sem medo de quebrar.',
                'intro' => 'Testes não são luxo — são a rede de segurança que permite mudar código com confiança. E no Laravel, escrevê-los é surpreendentemente agradável.',
                'sections' => [
                    ['h' => 'Comece pelos feature tests', 'p' => 'Testes de feature exercitam a aplicação de ponta a ponta: fazem uma requisição e checam a resposta e o banco. Eles dão o maior retorno de confiança por linha escrita.'],
                    ['h' => 'A sintaxe do Pest', 'p' => 'O Pest deixa os testes legíveis e expressivos, com menos cerimônia que o PHPUnit puro. Sob o capô, é o mesmo PHPUnit — você não perde nada.'],
                ],
                'tip' => 'Use um banco SQLite em memória nos testes: é rápido e isola cada teste com <code>RefreshDatabase</code>.',
                'outro' => 'Comece com poucos testes nos caminhos críticos e cresça a suíte aos poucos. Confiança para refatorar não tem preço.',
                'sources' => [['label' => 'Pest PHP', 'url' => 'https://pestphp.com/docs/installation'], ['label' => 'Testing — Laravel', 'url' => 'https://laravel.com/docs/testing']],
            ],
            [
                'category' => 'boas-praticas',
                'title' => 'SOLID na prática: os cinco princípios explicados',
                'description' => 'Um resumo direto de cada princípio com exemplos do dia a dia.',
                'intro' => 'SOLID é um conjunto de cinco princípios que guiam um design orientado a objetos mais flexível e fácil de manter. Vamos ao essencial de cada um.',
                'sections' => [
                    ['h' => 'Os cinco em uma frase cada', 'p' => 'Eles parecem abstratos, mas resolvem dores muito concretas do dia a dia.', 'ul' => ['<strong>S</strong>ingle Responsibility: uma classe, uma razão para mudar', '<strong>O</strong>pen/Closed: aberta para extensão, fechada para modificação', '<strong>L</strong>iskov: subtipos devem substituir seus tipos base sem surpresas', '<strong>I</strong>nterface Segregation: interfaces pequenas e específicas', '<strong>D</strong>ependency Inversion: dependa de abstrações, não de detalhes']],
                    ['h' => 'Princípios, não regras', 'p' => 'SOLID são diretrizes para reduzir acoplamento, não mandamentos. Aplicá-los cegamente gera over-engineering — use onde a complexidade justifica.'],
                ],
                'tip' => 'Se aplicar um princípio está deixando o código mais complicado em vez de mais claro, recue. O objetivo é simplicidade.',
                'outro' => 'SOLID ajuda a tomar boas decisões de design, mas não substitui o bom senso. Conheça as regras para saber quando quebrá-las.',
                'sources' => [['label' => 'The Principles of OOD — Robert C. Martin', 'url' => 'http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod']],
            ],
            [
                'category' => 'boas-praticas',
                'title' => 'Code review: como revisar (e ser revisado) sem dramas',
                'description' => 'Práticas para que o code review eleve o time em vez de gerar atrito.',
                'intro' => 'Code review é uma das melhores ferramentas de qualidade e aprendizado de um time. Mas, feito sem cuidado, vira fonte de conflito.',
                'sections' => [
                    ['h' => 'Revise o código, não a pessoa', 'p' => 'Comente o código, não quem o escreveu. Prefira perguntas a ordens ("o que acha de extrair isso?") e elogie o que estiver bom. O tom muda tudo.'],
                    ['h' => 'PRs pequenos, reviews melhores', 'p' => 'Pull requests grandes recebem reviews superficiais. PRs pequenos e focados são revisados a fundo e aprovados mais rápido — bom para todos.'],
                ],
                'tip' => 'Como autor, descreva o contexto e o porquê da mudança na descrição do PR. Você economiza o tempo de quem revisa.',
                'outro' => 'Um bom processo de review espalha conhecimento e melhora o código sem desgastar o time. É cultura, não só checklist.',
                'sources' => [['label' => 'Code Review — Google Engineering Practices', 'url' => 'https://google.github.io/eng-practices/review/']],
            ],

            // ───────────────────────── Ferramentas ─────────────────────────
            [
                'category' => 'ferramentas',
                'title' => 'Git: comandos do dia a dia que economizam tempo',
                'description' => 'Além de add, commit e push: os comandos que tornam o seu fluxo com Git mais fluido.',
                'intro' => 'Quase todo dev usa Git, mas poucos exploram os comandos que poupam tempo e evitam dores de cabeça no dia a dia.',
                'sections' => [
                    ['h' => 'Salvando e revisando', 'p' => 'Comandos simples resolvem situações comuns com elegância.', 'ul' => ['<code>git switch -c feature/x</code> — cria e troca de branch', '<code>git stash</code> — guarda mudanças temporariamente', '<code>git restore</code> — desfaz alterações no working tree', '<code>git log --oneline --graph</code> — visualiza o histórico']],
                    ['h' => 'Corrigindo com cuidado', 'p' => 'O <code>git rebase -i</code> reorganiza commits antes de compartilhar, e o <code>git revert</code> desfaz uma mudança já publicada com segurança. Evite reescrever histórico já compartilhado.'],
                ],
                'tip' => 'Configure aliases para os comandos que você mais usa. Pequenos atalhos somam muito ao longo do dia.',
                'outro' => 'Dominar o Git além do básico reduz o atrito e o medo de quebrar algo. Invista uma tarde nisso — o retorno é diário.',
                'sources' => [['label' => 'Pro Git (livro gratuito)', 'url' => 'https://git-scm.com/book/pt-br/v2']],
            ],
            [
                'category' => 'ferramentas',
                'title' => 'VS Code: extensões que todo dev web deveria ter',
                'description' => 'Uma seleção enxuta de extensões que melhoram produtividade sem pesar o editor.',
                'intro' => 'O VS Code é poderoso de fábrica, mas algumas extensões bem escolhidas elevam a experiência sem transformá-lo numa IDE pesada.',
                'sections' => [
                    ['h' => 'O essencial', 'p' => 'Formatação automática, lint e suporte à sua stack cobrem a base.', 'ul' => ['Prettier e ESLint para formatação e qualidade no front', 'Intelephense ou extensão de PHP para back-end', 'GitLens para entender o histórico inline', 'EditorConfig para padronizar o time']],
                    ['h' => 'Menos é mais', 'p' => 'Resista à tentação de instalar tudo. Cada extensão consome recursos e pode conflitar. Mantenha só o que você usa de verdade.'],
                ],
                'tip' => 'Sincronize suas configurações com o Settings Sync para ter o mesmo ambiente em qualquer máquina.',
                'outro' => 'Um editor bem configurado é uma extensão das suas mãos. Ajuste-o ao seu fluxo, mas evite o excesso.',
                'sources' => [['label' => 'VS Code — Documentação', 'url' => 'https://code.visualstudio.com/docs']],
            ],
            [
                'category' => 'ferramentas',
                'title' => 'Testando APIs como um profissional com Insomnia',
                'description' => 'Organize requisições, ambientes e variáveis para testar suas APIs com agilidade.',
                'intro' => 'Testar uma API direto no navegador ou no curl funciona, mas não escala. Ferramentas dedicadas organizam requisições e poupam muito retrabalho.',
                'sections' => [
                    ['h' => 'Coleções e ambientes', 'p' => 'Agrupe requisições em coleções e use ambientes para alternar entre local, staging e produção sem editar URLs na mão. Variáveis evitam repetição e erros.'],
                    ['h' => 'Autenticação reaproveitável', 'p' => 'Guarde tokens em variáveis de ambiente e injete-os automaticamente nos headers. Renovar a autenticação passa a ser um clique, não um copiar-e-colar.'],
                ],
                'tip' => 'Versione suas coleções junto do projeto: a documentação viva da API fica ao lado do código.',
                'outro' => 'Uma boa ferramenta de API transforma testes manuais tediosos em um fluxo rápido e confiável. Vale o tempo de configurar.',
                'sources' => [['label' => 'Insomnia — Documentação', 'url' => 'https://docs.insomnia.rest/']],
            ],
            [
                'category' => 'ferramentas',
                'title' => 'Vite: build moderno e ultrarrápido para o front-end',
                'description' => 'Por que o Vite virou padrão para projetos front-end e como ele acelera o desenvolvimento.',
                'intro' => 'O Vite repensou o build do front-end aproveitando os módulos ES nativos do navegador. O resultado é um dev server quase instantâneo.',
                'sections' => [
                    ['h' => 'Dev server instantâneo', 'p' => 'Em vez de empacotar tudo antes de iniciar, o Vite serve os módulos sob demanda. O servidor sobe na hora e o hot reload é praticamente imediato, mesmo em projetos grandes.'],
                    ['h' => 'Build otimizado', 'p' => 'Para produção, o Vite gera bundles enxutos e com code splitting automático. Você ganha velocidade no desenvolvimento sem abrir mão de um build eficiente.'],
                ],
                'tip' => 'No Laravel, o pacote oficial <code>laravel-vite-plugin</code> integra tudo com pouquíssima configuração.',
                'outro' => 'Se você ainda sofre com builds lentos, o Vite é uma atualização que se sente no primeiro minuto. Difícil voltar atrás.',
                'sources' => [['label' => 'Vite — Documentação', 'url' => 'https://vitejs.dev/guide/']],
            ],
        ];
    }
}
