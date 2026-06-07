<?php

namespace Tests\Feature;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageControllerTest extends TestCase
{
    use RefreshDatabase;

    private function activePage(array $attrs = []): Page
    {
        return Page::create(array_merge([
            'title' => 'Página Ativa',
            'is_active' => true,
            'is_searchable' => true,
        ], $attrs));
    }

    public function test_pagina_ativa_e_pesquisavel_retorna_200(): void
    {
        $page = $this->activePage(['title' => 'Sobre Nós']);

        $this->get(route('pages.show', $page->slug))
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->component('Page/Show')
                ->has('page')
            );
    }

    public function test_slug_inexistente_retorna_404(): void
    {
        $this->get(route('pages.show', 'slug-que-nao-existe'))
            ->assertNotFound();
    }

    public function test_pagina_inativa_retorna_404(): void
    {
        $page = $this->activePage(['title' => 'Inativa', 'is_active' => false]);

        $this->get(route('pages.show', $page->slug))
            ->assertNotFound();
    }

    public function test_pagina_nao_pesquisavel_retorna_404(): void
    {
        $page = $this->activePage(['title' => 'Oculta', 'is_searchable' => false]);

        $this->get(route('pages.show', $page->slug))
            ->assertNotFound();
    }
}
