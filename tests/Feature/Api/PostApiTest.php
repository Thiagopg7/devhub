<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use App\Support\ApiCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $this->token = $user->createToken('api-test')->plainTextToken;
    }

    private function autenticado(): static
    {
        return $this->withToken($this->token);
    }

    // --- GET /api/posts ---

    public function test_retorna_apenas_posts_ativos(): void
    {
        Post::factory()->count(3)->create(['is_active' => true]);
        Post::factory()->count(2)->create(['is_active' => false]);

        $this->autenticado()->getJson('/api/posts')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_retorna_listagem_paginada(): void
    {
        Post::factory()->count(5)->create(['is_active' => true]);

        $this->autenticado()->getJson('/api/posts')
            ->assertOk()
            ->assertJsonStructure([
                'data',
                'links',
                'meta' => ['current_page', 'per_page', 'total'],
            ]);
    }

    public function test_nao_retorna_posts_agendados(): void
    {
        Post::factory()->count(2)->create(['is_active' => true]);
        Post::factory()->scheduled()->create(['is_active' => true]);

        $this->autenticado()->getJson('/api/posts')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_expoe_campos_destaque_e_publicacao(): void
    {
        Post::factory()->featured()->create(['is_active' => true]);

        $this->autenticado()->getJson('/api/posts')
            ->assertOk()
            ->assertJsonStructure(['data' => [['is_featured', 'published_at']]])
            ->assertJsonPath('data.0.is_featured', true);
    }

    // --- GET /api/posts/{slug} ---

    public function test_retorna_post_pelo_slug(): void
    {
        $post = Post::factory()->create(['is_active' => true]);

        $this->autenticado()->getJson("/api/posts/{$post->slug}")
            ->assertOk()
            ->assertJsonFragment(['slug' => $post->slug]);
    }

    public function test_retorna_404_para_slug_inexistente(): void
    {
        $this->autenticado()->getJson('/api/posts/slug-que-nao-existe')
            ->assertNotFound();
    }

    public function test_retorna_404_para_post_inativo(): void
    {
        Post::factory()->create(['is_active' => false, 'slug' => 'post-inativo']);

        $this->autenticado()->getJson('/api/posts/post-inativo')
            ->assertNotFound();
    }

    public function test_retorna_404_para_post_agendado(): void
    {
        Post::factory()->scheduled()->create(['is_active' => true, 'slug' => 'post-agendado']);

        $this->autenticado()->getJson('/api/posts/post-agendado')
            ->assertNotFound();
    }

    // --- cache ---

    public function test_listagem_e_cacheada_e_invalidada_ao_salvar(): void
    {
        Post::factory()->create(['is_active' => true]);
        $this->autenticado()->getJson('/api/posts')->assertJsonCount(1, 'data');

        $this->assertTrue(Cache::tags(ApiCache::POSTS)->has('index.all.page.1'));

        Post::factory()->create(['is_active' => true]);
        $this->assertFalse(Cache::tags(ApiCache::POSTS)->has('index.all.page.1'));

        $this->autenticado()->getJson('/api/posts')->assertJsonCount(2, 'data');
    }

    public function test_cache_de_posts_invalidado_ao_renomear_categoria(): void
    {
        $category = Category::create(['name' => 'Tech', 'color' => '#000', 'is_active' => true]);
        $post = Post::factory()->create(['is_active' => true, 'category_id' => $category->id]);

        $this->autenticado()->getJson("/api/posts/{$post->slug}")
            ->assertJsonPath('data.category.name', 'Tech');

        $category->update(['name' => 'Tecnologia']);

        $this->autenticado()->getJson("/api/posts/{$post->slug}")
            ->assertJsonPath('data.category.name', 'Tecnologia');
    }
}
