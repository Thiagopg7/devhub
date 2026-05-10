<?php

namespace Tests\Feature\Api;

use App\Models\ApiToken;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    private string $plainToken = 'token-de-teste-123';

    protected function setUp(): void
    {
        parent::setUp();

        ApiToken::factory()->create([
            'token_hash' => hash('sha256', $this->plainToken),
            'expires_at' => null,
        ]);
    }

    private function autenticado(): static
    {
        return $this->withToken($this->plainToken);
    }

    // --- GET /api/posts ---

    public function test_retorna_apenas_posts_ativos(): void
    {
        Post::factory()->count(3)->create(['is_active' => true]);
        Post::factory()->count(2)->create(['is_active' => false]);

        $response = $this->autenticado()->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_retorna_listagem_paginada(): void
    {
        Post::factory()->count(5)->create(['is_active' => true]);

        $response = $this->autenticado()->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'current_page',
                'per_page',
                'total',
            ]);
    }

    // --- GET /api/posts/{slug} ---

    public function test_retorna_post_pelo_slug(): void
    {
        $post = Post::factory()->create(['is_active' => true]);

        $response = $this->autenticado()->getJson("/api/posts/{$post->slug}");

        $response->assertStatus(200)
            ->assertJsonFragment(['slug' => $post->slug]);
    }

    public function test_retorna_404_para_slug_inexistente(): void
    {
        $response = $this->autenticado()->getJson('/api/posts/slug-que-nao-existe');

        $response->assertStatus(404);
    }

    public function test_retorna_404_para_post_inativo(): void
    {
        Post::factory()->create([
            'is_active' => false,
            'slug'      => 'post-inativo',
        ]);

        $response = $this->autenticado()->getJson('/api/posts/post-inativo');

        $response->assertStatus(404);
    }
}
