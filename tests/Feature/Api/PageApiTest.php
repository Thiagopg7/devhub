<?php

namespace Tests\Feature\Api;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            'title'     => 'Sobre Nós',
            'slug'      => 'sobre-nos',
            'is_active' => true,
        ]);

        $this->withToken($this->token())->getJson('/api/pages/sobre-nos')
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['title', 'slug', 'content', 'banner_image', 'meta_title', 'meta_description'],
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
}
