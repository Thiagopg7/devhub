<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogControllerTest extends TestCase
{
    use RefreshDatabase;

    private function author(): User
    {
        return User::factory()->create();
    }

    public function test_index_lista_posts_ativos(): void
    {
        $author = $this->author();
        Post::factory()->create(['title' => 'Post Visível', 'is_active' => true, 'user_id' => $author->id]);
        Post::factory()->create(['title' => 'Post Oculto', 'is_active' => false, 'user_id' => $author->id]);

        $this->get(route('blog.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Blog/Index')
                ->has('posts.data', 1)
            );
    }

    public function test_index_filtra_por_busca(): void
    {
        $author = $this->author();
        Post::factory()->create(['title' => 'Laravel Avançado', 'is_active' => true, 'user_id' => $author->id]);
        Post::factory()->create(['title' => 'Vue.js Básico', 'is_active' => true, 'user_id' => $author->id]);

        $this->get(route('blog.index', ['busca' => 'Laravel']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Blog/Index')
                ->has('posts.data', 1)
                ->where('filters.busca', 'Laravel')
            );
    }

    public function test_show_exibe_post_ativo(): void
    {
        $author = $this->author();
        $post = Post::factory()->create(['is_active' => true, 'user_id' => $author->id]);

        $this->get(route('blog.show', $post->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Blog/Show')
                ->has('post')
            );
    }

    public function test_show_retorna_404_para_post_inativo(): void
    {
        $author = $this->author();
        $post = Post::factory()->create(['is_active' => false, 'user_id' => $author->id]);

        $this->get(route('blog.show', $post->slug))
            ->assertNotFound();
    }

    public function test_show_retorna_404_para_slug_inexistente(): void
    {
        $this->get(route('blog.show', 'slug-que-nao-existe'))
            ->assertNotFound();
    }

    public function test_by_category_lista_posts_da_categoria(): void
    {
        $author = $this->author();
        $category = Category::create(['name' => 'Tech', 'color' => '#000000', 'is_active' => true]);
        Post::factory()->create(['is_active' => true, 'user_id' => $author->id, 'category_id' => $category->id]);

        $this->get(route('blog.category', $category->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Blog/Category')
                ->has('category')
                ->has('posts.data', 1)
            );
    }

    public function test_by_category_retorna_404_para_categoria_inexistente(): void
    {
        $this->get(route('blog.category', 'categoria-inexistente'))
            ->assertNotFound();
    }

    public function test_by_category_retorna_404_para_categoria_inativa(): void
    {
        $category = Category::create(['name' => 'Inativa', 'color' => '#000000', 'is_active' => false]);

        $this->get(route('blog.category', $category->slug))
            ->assertNotFound();
    }
}
