<?php

namespace Tests\Feature;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgendaControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lista_eventos_ativos(): void
    {
        Event::factory()->create(['title' => 'Evento Visível', 'is_active' => true]);
        Event::factory()->create(['title' => 'Evento Oculto', 'is_active' => false]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->has('events.data', 1)
                ->where('events.data.0.title', 'Evento Visível')
            );
    }

    public function test_index_retorna_campos_computados(): void
    {
        Event::factory()->create([
            'date' => '2026-08-15',
            'type' => 'conf',
            'is_active' => true,
        ]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('events.data.0.day', '15')
                ->where('events.data.0.month', 'Ago')
                ->where('events.data.0.year', '2026')
                ->where('events.data.0.type_label', 'Conferência')
            );
    }

    public function test_index_ordena_por_order_e_date(): void
    {
        Event::factory()->create(['title' => 'B', 'order' => 2, 'date' => '2026-07-01', 'is_active' => true]);
        Event::factory()->create(['title' => 'A', 'order' => 1, 'date' => '2026-08-01', 'is_active' => true]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('events.data.0.title', 'A')
                ->where('events.data.1.title', 'B')
            );
    }

    public function test_index_pagina_em_lotes(): void
    {
        Event::factory()->count(7)->create(['is_active' => true]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->has('events.data', 6)
                ->where('events.total', 7)
                ->where('events.current_page', 1)
                ->where('events.last_page', 2)
            );
    }

    public function test_index_segunda_pagina_traz_o_restante(): void
    {
        Event::factory()->count(7)->create(['is_active' => true]);

        $this->get(route('agenda', ['page' => 2]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->has('events.data', 1)
                ->where('events.current_page', 2)
            );
    }

    public function test_index_filtra_por_status(): void
    {
        Event::factory()->count(2)->create(['status' => 'open', 'is_active' => true]);
        Event::factory()->create(['status' => 'full', 'is_active' => true]);

        $this->get(route('agenda', ['status' => 'full']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('events.total', 1)
                ->where('events.data.0.status', 'full')
                ->where('filters.status', 'full')
            );
    }

    public function test_index_ignora_status_invalido(): void
    {
        Event::factory()->count(3)->create(['is_active' => true]);

        $this->get(route('agenda', ['status' => 'inexistente']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('events.total', 3)
                ->where('filters.status', null)
            );
    }

    public function test_index_retorna_contadores_por_status(): void
    {
        Event::factory()->count(2)->create(['status' => 'open', 'is_active' => true]);
        Event::factory()->create(['status' => 'full', 'is_active' => true]);
        Event::factory()->create(['status' => 'soon', 'is_active' => true]);
        Event::factory()->create(['status' => 'open', 'is_active' => false]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('counts.all', 4)
                ->where('counts.open', 2)
                ->where('counts.full', 1)
                ->where('counts.soon', 1)
            );
    }
}
