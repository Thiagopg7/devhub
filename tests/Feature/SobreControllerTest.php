<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SobreControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_retorna_estatisticas_reais(): void
    {
        $category = Category::create(['name' => 'PHP', 'color' => '#000000', 'is_active' => true]);
        Post::factory()->count(2)->create(['category_id' => $category->id]);

        $this->get(route('sobre'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Sobre')
                ->where('stats.publishedPosts', 2)
                ->where('stats.categories', 1)
                ->has('tracks', 1)
                ->where('tracks.0.name', 'PHP')
                ->where('tracks.0.posts_count', 2)
            );
    }

    public function test_index_ordena_trilhas_por_contagem_de_posts(): void
    {
        $poucos = Category::create(['name' => 'Poucos', 'color' => '#000000', 'icon' => 'Code', 'is_active' => true]);
        $muitos = Category::create(['name' => 'Muitos', 'color' => '#000000', 'is_active' => true]);
        Post::factory()->create(['category_id' => $poucos->id]);
        Post::factory()->count(3)->create(['category_id' => $muitos->id]);

        $this->get(route('sobre'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Sobre')
                ->where('tracks.0.name', 'Muitos') // mais posts primeiro
                ->where('tracks.0.icon', null)
                ->where('tracks.1.name', 'Poucos')
                ->where('tracks.1.icon', 'Code')
            );
    }

    public function test_index_ignora_categorias_inativas(): void
    {
        Category::create(['name' => 'Ativa', 'color' => '#000000', 'is_active' => true]);
        Category::create(['name' => 'Inativa', 'color' => '#000000', 'is_active' => false]);

        $this->get(route('sobre'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Sobre')
                ->where('stats.categories', 1)
                ->has('tracks', 1)
                ->where('tracks.0.name', 'Ativa')
            );
    }
}
