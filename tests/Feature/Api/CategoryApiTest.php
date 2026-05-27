<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
