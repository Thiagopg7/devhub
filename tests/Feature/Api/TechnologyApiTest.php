<?php

namespace Tests\Feature\Api;

use App\Models\Technology;
use App\Models\User;
use App\Support\ApiCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class TechnologyApiTest extends TestCase
{
    use CreatesAdminUser, RefreshDatabase;

    private function token(): string
    {
        return User::factory()->create()->createToken('test')->plainTextToken;
    }

    public function test_lista_apenas_ativas_em_ordem(): void
    {
        Technology::create(['name' => 'Laravel', 'url' => 'https://laravel.com', 'order' => 2, 'is_active' => true]);
        Technology::create(['name' => 'React', 'url' => 'https://react.dev', 'order' => 1, 'is_active' => true]);
        Technology::create(['name' => 'Oculta', 'url' => 'https://x', 'order' => 3, 'is_active' => false]);

        $response = $this->withToken($this->token())->getJson('/api/technologies')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->assertSame('React', $response->json('data.0.name'));
        $this->assertSame('Laravel', $response->json('data.1.name'));
    }

    public function test_retorna_estrutura_correta(): void
    {
        Technology::create(['name' => 'Vite', 'url' => 'https://vite.dev', 'order' => 1, 'is_active' => true]);

        $this->withToken($this->token())->getJson('/api/technologies')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'name', 'description', 'url', 'icon_image', 'screenshot_image', 'order']],
            ]);
    }

    public function test_requer_autenticacao(): void
    {
        $this->getJson('/api/technologies')->assertUnauthorized();
    }

    public function test_resposta_e_servida_do_cache(): void
    {
        $token = $this->token();
        Technology::create(['name' => 'A', 'url' => 'https://a', 'order' => 1, 'is_active' => true]);

        $this->withToken($token)->getJson('/api/technologies')->assertJsonCount(1, 'data');

        DB::table('technologies')->insert([
            'name' => 'B', 'url' => 'https://b', 'order' => 2, 'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->withToken($token)->getJson('/api/technologies')->assertJsonCount(1, 'data');

        ApiCache::flush(ApiCache::TECHNOLOGIES);
        $this->withToken($token)->getJson('/api/technologies')->assertJsonCount(2, 'data');
    }

    public function test_cache_invalidado_ao_salvar(): void
    {
        $token = $this->token();
        Technology::create(['name' => 'A', 'url' => 'https://a', 'order' => 1, 'is_active' => true]);
        $this->withToken($token)->getJson('/api/technologies')->assertJsonCount(1, 'data');

        Technology::create(['name' => 'B', 'url' => 'https://b', 'order' => 2, 'is_active' => true]);
        $this->withToken($token)->getJson('/api/technologies')->assertJsonCount(2, 'data');
    }

    public function test_cache_invalidado_no_reorder(): void
    {
        $token = $this->token();
        $a = Technology::create(['name' => 'A', 'url' => 'https://a', 'order' => 1, 'is_active' => true]);
        $b = Technology::create(['name' => 'B', 'url' => 'https://b', 'order' => 2, 'is_active' => true]);

        $this->withToken($token)->getJson('/api/technologies')
            ->assertJsonPath('data.0.name', 'A');

        $this->actingAs($this->adminUser(['technologies.edit']))
            ->post(route('admin.reorder'), [
                'model' => 'technology',
                'items' => [
                    ['id' => $a->id, 'order' => 2],
                    ['id' => $b->id, 'order' => 1],
                ],
            ])->assertRedirect();

        $this->withToken($token)->getJson('/api/technologies')
            ->assertJsonPath('data.0.name', 'B');
    }
}
