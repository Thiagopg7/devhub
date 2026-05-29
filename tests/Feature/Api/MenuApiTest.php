<?php

namespace Tests\Feature\Api;

use App\Models\MenuItem;
use App\Models\User;
use App\Support\ApiCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class MenuApiTest extends TestCase
{
    use CreatesAdminUser, RefreshDatabase;

    private function token(): string
    {
        return User::factory()->create()->createToken('test')->plainTextToken;
    }

    public function test_retorna_apenas_itens_ativos(): void
    {
        MenuItem::create(['label' => 'Blog', 'url' => '/blog', 'order' => 1, 'is_active' => true]);
        MenuItem::create(['label' => 'Oculto', 'url' => '/oculto', 'order' => 2, 'is_active' => false]);

        $this->withToken($this->token())->getJson('/api/menu')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['label' => 'Blog']);
    }

    public function test_retorna_estrutura_com_filhos(): void
    {
        $parent = MenuItem::create(['label' => 'Serviços', 'url' => '#', 'order' => 1, 'is_active' => true]);
        MenuItem::create(['label' => 'Consultoria', 'url' => '/consultoria', 'order' => 1, 'is_active' => true, 'parent_id' => $parent->id]);

        $response = $this->withToken($this->token())->getJson('/api/menu')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['label', 'url', 'open_in_new_tab', 'children']],
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data[0]['children']);
        $this->assertSame('Consultoria', $data[0]['children'][0]['label']);
    }

    public function test_filhos_inativos_nao_aparecem(): void
    {
        $parent = MenuItem::create(['label' => 'Pai', 'url' => '#', 'order' => 1, 'is_active' => true]);
        MenuItem::create(['label' => 'Filho Inativo', 'url' => '/x', 'order' => 1, 'is_active' => false, 'parent_id' => $parent->id]);

        $response = $this->withToken($this->token())->getJson('/api/menu')->assertOk();

        $this->assertEmpty($response->json('data.0.children'));
    }

    public function test_requer_autenticacao(): void
    {
        $this->getJson('/api/menu')
            ->assertUnauthorized();
    }

    public function test_resposta_e_servida_do_cache(): void
    {
        $token = $this->token();
        MenuItem::create(['label' => 'Blog', 'url' => '/blog', 'order' => 1, 'is_active' => true]);

        $this->withToken($token)->getJson('/api/menu')->assertJsonCount(1, 'data');

        DB::table('menu_items')->insert([
            'label' => 'Sobre', 'url' => '/sobre', 'order' => 2, 'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->withToken($token)->getJson('/api/menu')->assertJsonCount(1, 'data');

        ApiCache::flush(ApiCache::MENU);
        $this->withToken($token)->getJson('/api/menu')->assertJsonCount(2, 'data');
    }

    public function test_cache_invalidado_no_reorder(): void
    {
        $token = $this->token();
        $a = MenuItem::create(['label' => 'A', 'url' => '/a', 'order' => 1, 'is_active' => true]);
        $b = MenuItem::create(['label' => 'B', 'url' => '/b', 'order' => 2, 'is_active' => true]);

        $this->withToken($token)->getJson('/api/menu')->assertJsonPath('data.0.label', 'A');

        $this->actingAs($this->adminUser(['menu.edit']))
            ->post(route('admin.reorder'), [
                'model' => 'menu_item',
                'items' => [
                    ['id' => $a->id, 'order' => 2],
                    ['id' => $b->id, 'order' => 1],
                ],
            ])->assertRedirect();

        $this->withToken($token)->getJson('/api/menu')->assertJsonPath('data.0.label', 'B');
    }
}
