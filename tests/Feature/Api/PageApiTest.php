<?php

namespace Tests\Feature\Api;

use App\Models\Page;
use App\Models\User;
use App\Support\ApiCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PageApiTest extends TestCase
{
    use RefreshDatabase;

    private function token(): string
    {
        return User::factory()->create()->createToken('test')->plainTextToken;
    }

    public function test_retorna_pagina_pelo_slug(): void
    {
        Page::create([
            'title' => 'Sobre Nós',
            'slug' => 'sobre-nos',
            'is_active' => true,
        ]);

        $this->withToken($this->token())->getJson('/api/pages/sobre-nos')
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['title', 'slug', 'content', 'eyebrow', 'main_image', 'meta_title', 'meta_description'],
            ])
            ->assertJsonFragment(['title' => 'Sobre Nós']);
    }

    public function test_retorna_404_para_slug_inexistente(): void
    {
        $this->withToken($this->token())->getJson('/api/pages/nao-existe')
            ->assertNotFound();
    }

    public function test_retorna_404_para_pagina_inativa(): void
    {
        Page::create(['title' => 'Inativa', 'slug' => 'inativa', 'is_active' => false]);

        $this->withToken($this->token())->getJson('/api/pages/inativa')
            ->assertNotFound();
    }

    public function test_requer_autenticacao(): void
    {
        $this->getJson('/api/pages/qualquer')
            ->assertUnauthorized();
    }

    // --- cache ---

    public function test_e_cacheada_e_invalidada_ao_atualizar(): void
    {
        $page = Page::create(['title' => 'Servicos', 'slug' => 'servicos', 'subtitle' => 'Antigo', 'is_active' => true]);

        $this->withToken($this->token())->getJson('/api/pages/servicos')
            ->assertJsonPath('data.subtitle', 'Antigo');
        $this->assertTrue(Cache::tags(ApiCache::PAGES)->has('show.servicos'));

        $page->update(['subtitle' => 'Novo']);

        $this->withToken($this->token())->getJson('/api/pages/servicos')
            ->assertJsonPath('data.subtitle', 'Novo');
    }

    public function test_cache_invalidado_ao_alterar_galeria(): void
    {
        $page = Page::create(['title' => 'Galeria', 'slug' => 'galeria', 'is_active' => true]);

        $this->withToken($this->token())->getJson('/api/pages/galeria')
            ->assertJsonPath('data.gallery', []);

        $page->galleryImages()->create(['image' => 'gallery/foto.jpg']);

        $response = $this->withToken($this->token())->getJson('/api/pages/galeria')->assertOk();
        $this->assertCount(1, $response->json('data.gallery'));
    }
}
