<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use App\Support\ApiCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    private function token(): string
    {
        return User::factory()->create()->createToken('test')->plainTextToken;
    }

    public function test_lista_apenas_categorias_ativas(): void
    {
        Category::create(['name' => 'Ativa', 'color' => '#000', 'is_active' => true]);
        Category::create(['name' => 'Inativa', 'color' => '#000', 'is_active' => false]);

        $this->withToken($this->token())->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => 'Ativa']);
    }

    public function test_retorna_estrutura_correta(): void
    {
        Category::create(['name' => 'Tech', 'color' => '#3B82F6', 'is_active' => true]);

        $this->withToken($this->token())->getJson('/api/categories')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'name', 'slug', 'color', 'posts_count']],
            ]);
    }

    public function test_requer_autenticacao(): void
    {
        $this->getJson('/api/categories')
            ->assertUnauthorized();
    }

    public function test_lista_vazia_quando_nao_ha_categorias(): void
    {
        $this->withToken($this->token())->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_resposta_e_servida_do_cache(): void
    {
        $token = $this->token();
        Category::create(['name' => 'A', 'color' => '#000', 'is_active' => true]);

        $this->withToken($token)->getJson('/api/categories')->assertJsonCount(1, 'data');

        // INSERT direto no banco não dispara model events: o cache não é invalidado.
        DB::table('categories')->insert([
            'name' => 'B', 'slug' => 'b', 'color' => '#000', 'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Ainda servindo a versão cacheada (1 item), provando que houve cache.
        $this->withToken($token)->getJson('/api/categories')->assertJsonCount(1, 'data');

        // Após invalidar, a resposta reflete o banco (2 itens).
        ApiCache::flush(ApiCache::CATEGORIES);
        $this->withToken($token)->getJson('/api/categories')->assertJsonCount(2, 'data');
    }

    public function test_cache_invalidado_ao_salvar_categoria(): void
    {
        $token = $this->token();
        Category::create(['name' => 'A', 'color' => '#000', 'is_active' => true]);
        $this->withToken($token)->getJson('/api/categories')->assertJsonCount(1, 'data');

        // Criar via model dispara o evento saved -> invalida o cache.
        Category::create(['name' => 'B', 'color' => '#000', 'is_active' => true]);
        $this->withToken($token)->getJson('/api/categories')->assertJsonCount(2, 'data');
    }

    public function test_show_retorna_categoria_com_seus_posts_publicados(): void
    {
        $category = Category::create(['name' => 'DevOps', 'color' => '#000', 'is_active' => true]);
        $user = User::factory()->create();
        Post::factory()->for($user)->create(['category_id' => $category->id, 'title' => 'Publicado']);
        Post::factory()->for($user)->scheduled()->create(['category_id' => $category->id, 'title' => 'Agendado']);

        $this->withToken($this->token())->getJson("/api/categories/{$category->slug}")
            ->assertOk()
            ->assertJsonPath('data.slug', $category->slug)
            ->assertJsonCount(1, 'data.posts')
            ->assertJsonPath('data.posts.0.title', 'Publicado');
    }

    public function test_show_retorna_404_para_categoria_inexistente(): void
    {
        $this->withToken($this->token())->getJson('/api/categories/nao-existe')
            ->assertNotFound();
    }

    public function test_cache_invalidado_ao_mudar_contagem_de_posts(): void
    {
        $token = $this->token();
        $category = Category::create(['name' => 'A', 'color' => '#000', 'is_active' => true]);
        $user = User::factory()->create();

        $this->withToken($token)->getJson('/api/categories')
            ->assertJsonPath('data.0.posts_count', 0);

        // Novo post na categoria deve invalidar o cache (posts_count vai a 1).
        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Post',
            'is_active' => true,
        ]);

        $this->withToken($token)->getJson('/api/categories')
            ->assertJsonPath('data.0.posts_count', 1);
    }
}
