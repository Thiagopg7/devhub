<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Event;
use App\Models\Post;
use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_destaca_post_marcado_como_featured(): void
    {
        Post::factory()->create(['title' => 'Comum']);
        Post::factory()->featured()->create(['title' => 'Destaque']);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->where('featuredPost.title', 'Destaque')
            );
    }

    public function test_home_passa_apenas_tecnologias_ativas(): void
    {
        Technology::create(['name' => 'Ativa', 'url' => 'https://a.dev', 'order' => 1, 'is_active' => true]);
        Technology::create(['name' => 'Inativa', 'url' => 'https://b.dev', 'order' => 2, 'is_active' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->has('technologies', 1)
                ->where('technologies.0.name', 'Ativa')
            );
    }

    public function test_home_lista_apenas_eventos_futuros_e_ativos(): void
    {
        Event::factory()->create(['title' => 'Futuro', 'date' => now()->addWeek()->format('Y-m-d')]);
        Event::factory()->create(['title' => 'Passado', 'date' => now()->subWeek()->format('Y-m-d')]);
        Event::factory()->inactive()->create(['title' => 'Inativo', 'date' => now()->addWeek()->format('Y-m-d')]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->has('upcomingEvents', 1)
                ->where('upcomingEvents.0.title', 'Futuro')
            );
    }

    public function test_home_calcula_estatisticas_reais(): void
    {
        Post::factory()->count(3)->create();      // publicados (published_at = now)
        Post::factory()->scheduled()->create();   // agendado (futuro) — não conta
        Category::create(['name' => 'Ativa', 'color' => '#000', 'is_active' => true]);
        Category::create(['name' => 'Inativa', 'color' => '#000', 'is_active' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->where('stats.publishedPosts', 3)
                ->where('stats.categories', 1)
            );
    }
}
