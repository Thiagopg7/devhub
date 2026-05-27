<?php

namespace Tests\Feature\Api;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $user        = User::factory()->create();
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
}
