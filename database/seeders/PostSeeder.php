<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        $cat = fn (string $slug) => Category::where('slug', $slug)->value('id');

        $this->copyImages();

        $posts = [
            [
                'category_id' => $cat('desenvolvimento-web'),
                'title' => 'Começando com Laravel: do zero ao primeiro CRUD',
                'description' => 'Um guia prático para quem quer entrar no ecossistema Laravel e construir sua primeira aplicação com rotas, controllers e Eloquent.',
                'banner_image' => 'posts/laravel-crud.jpg',
                'content' => '<p>Laravel é um framework PHP que prioriza a experiência do desenvolvedor. Neste post vamos criar juntos um CRUD completo, passando por migrations, models, controllers e views.</p><p>Ao final você terá uma base sólida para evoluir em qualquer projeto Laravel.</p>',
                'meta_title' => 'Começando com Laravel — Guia Prático',
                'meta_description' => 'Aprenda a criar seu primeiro CRUD com Laravel do zero, com migrations, Eloquent e controllers.',
                'is_active' => true,
                'slug' => 'começando-com-laravel-do-zero-ao-primeiro-crud',
            ],
            [
                'category_id' => $cat('desenvolvimento-web'),
                'title' => 'React com Inertia.js: SPA sem API REST',
                'description' => 'Como o Inertia.js une o melhor do React com o back-end Laravel, eliminando a necessidade de uma API separada para SPAs.',
                'banner_image' => 'posts/react-inertia.png',
                'content' => '<p>O Inertia.js permite construir SPAs modernas usando seu framework back-end favorito como roteador, sem precisar manter uma API REST dedicada.</p><p>Neste artigo exploramos o modelo mental do Inertia, como os dados fluem entre Laravel e React, e como lidar com autenticação e compartilhamento de estado.</p>',
                'meta_title' => 'React + Inertia.js — SPA sem API',
                'meta_description' => 'Entenda como o Inertia.js conecta React e Laravel para criar SPAs sem uma API REST separada.',
                'is_active' => true,
                'slug' => 'react-com-inertia-js-spa-sem-api-rest',
            ],
            [
                'category_id' => $cat('banco-de-dados'),
                'title' => 'Migrations no Laravel: versionando seu banco de dados',
                'description' => 'Como usar migrations para manter o esquema do banco sincronizado entre ambientes e equipes, evitando o famoso "funciona na minha máquina".',
                'banner_image' => 'posts/laravel-migrations.webp',
                'content' => '<p>Migrations são a forma do Laravel versionar mudanças no banco de dados como se fossem commits de código. Cada migration representa uma alteração atômica e reversível no esquema.</p><p>Vamos ver como criar, rodar, reverter e organizar migrations em projetos reais.</p>',
                'meta_title' => 'Migrations Laravel — Versionamento de Banco',
                'meta_description' => 'Aprenda a usar migrations no Laravel para versionar seu banco de dados de forma segura e colaborativa.',
                'is_active' => true,
                'slug' => 'migrations-no-laravel-versionando-seu-banco-de-dados',
            ],
            [
                'category_id' => $cat('devops'),
                'title' => 'Docker para desenvolvedores PHP: ambiente consistente em minutos',
                'description' => 'Monte um ambiente de desenvolvimento PHP com Docker e Docker Compose e nunca mais sofra com inconsistências entre máquinas.',
                'banner_image' => 'posts/docker-php-laravel.png',
                'content' => '<p>Com Docker você define o ambiente da aplicação como código, garantindo que todos os membros do time — e o servidor de produção — rodem exatamente a mesma coisa.</p><p>Vamos montar do zero um docker-compose.yml com PHP-FPM, Nginx e MySQL, prontos para um projeto Laravel.</p>',
                'meta_title' => 'Docker para PHP — Ambiente Consistente',
                'meta_description' => 'Configure um ambiente PHP com Docker e Docker Compose em minutos, do zero ao servidor rodando.',
                'is_active' => true,
                'slug' => 'docker-para-desenvolvedores-php-ambiente-consistente-em-minutos',
            ],
            [
                'category_id' => $cat('boas-praticas'),
                'title' => 'Service Layer no Laravel: separando responsabilidades',
                'description' => 'Por que e como extrair a lógica de negócio dos controllers para uma camada de serviços, tornando o código mais testável e organizado.',
                'banner_image' => 'posts/service-layer-pattern.webp',
                'content' => '<p>Controllers gordos são um problema comum em projetos Laravel que crescem sem planejamento. A Service Layer resolve isso extraindo a lógica de negócio para classes dedicadas.</p><p>Veremos como estruturar services, injetá-los via construtor e ganhar testabilidade sem sacrificar a simplicidade do Laravel.</p>',
                'meta_title' => 'Service Layer Laravel — Separando Responsabilidades',
                'meta_description' => 'Aprenda a usar a Service Layer no Laravel para organizar a lógica de negócio fora dos controllers.',
                'is_active' => true,
                'slug' => 'service-layer-no-laravel-separando-responsabilidades',
            ],
            [
                'category_id' => $cat('carreira'),
                'title' => 'Portfólio para devs: o que realmente importa para recrutadores',
                'description' => 'Dicas práticas sobre o que incluir (e o que evitar) no portfólio de desenvolvedor para chamar atenção nas etapas de triagem.',
                'banner_image' => 'posts/portfolio-dev.webp',
                'content' => '<p>Um portfólio forte não precisa de dezenas de projetos. Dois ou três projetos bem documentados, com README claro, deploy acessível e código limpo valem mais do que um repositório cheio de CRUDs abandonados.</p><p>Neste post compartilho o que recrutadores técnicos realmente olham e como apresentar seu trabalho da melhor forma.</p>',
                'meta_title' => 'Portfólio Dev — O que Recrutadores Realmente Olham',
                'meta_description' => 'Saiba o que incluir no seu portfólio de desenvolvedor para se destacar nas triagens e entrevistas técnicas.',
                'is_active' => true,
                'slug' => 'portfolio-para-devs-o-que-realmente-importa-para-recrutadores',
            ],
        ];

        foreach ($posts as $i => $data) {
            $post = Post::firstOrCreate(
                ['title' => $data['title']],
                array_merge($data, [
                    'user_id' => $user->id,
                    'published_at' => now()->subDays($i),
                ])
            );

            if (! $post->banner_image) {
                $post->update(['banner_image' => $data['banner_image']]);
            }
        }
    }

    private function copyImages(): void
    {
        $map = [
            'posts/laravel-crud.jpg' => public_path('images.jpg'),
            'posts/react-inertia.png' => public_path('images.png'),
            'posts/laravel-migrations.webp' => public_path('laravel-mirgrations-uses.webp'),
            'posts/docker-php-laravel.png' => public_path('Docker.png'),
            'posts/service-layer-pattern.webp' => public_path('service_layer_pattern.webp'),
            'posts/portfolio-dev.webp' => public_path('6915fe19-24dc-45cf-a2b4-acb5a31434dd.webp'),
        ];

        foreach ($map as $dest => $src) {
            if (! Storage::disk('public')->exists($dest) && file_exists($src)) {
                Storage::disk('public')->put($dest, file_get_contents($src));
            }
        }
    }
}
