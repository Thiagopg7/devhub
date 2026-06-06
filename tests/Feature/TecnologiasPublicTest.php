<?php

namespace Tests\Feature;

use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TecnologiasPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_pagina_passa_apenas_tecnologias_ativas_ordenadas(): void
    {
        Technology::create(['name' => 'Beta', 'url' => 'https://b.dev', 'order' => 2, 'is_active' => true]);
        Technology::create(['name' => 'Alpha', 'url' => 'https://a.dev', 'order' => 1, 'is_active' => true]);
        Technology::create(['name' => 'Oculta', 'url' => 'https://o.dev', 'order' => 3, 'is_active' => false]);

        $this->get('/tecnologias')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Technologies/Index')
                ->has('technologies', 2)
                ->where('technologies.0.name', 'Alpha')
                ->where('technologies.1.name', 'Beta')
            );
    }
}
