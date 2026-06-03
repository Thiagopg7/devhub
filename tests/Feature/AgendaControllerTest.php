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
                ->has('events', 1)
                ->where('events.0.title', 'Evento Visível')
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
                ->where('events.0.day', '15')
                ->where('events.0.month', 'Ago')
                ->where('events.0.year', '2026')
                ->where('events.0.type_label', 'Conferência')
            );
    }

    public function test_index_ordena_por_order_e_date(): void
    {
        Event::factory()->create(['title' => 'B', 'order' => 2, 'date' => '2026-07-01', 'is_active' => true]);
        Event::factory()->create(['title' => 'A', 'order' => 1, 'date' => '2026-08-01', 'is_active' => true]);

        $this->get(route('agenda'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Agenda')
                ->where('events.0.title', 'A')
                ->where('events.1.title', 'B')
            );
    }
}
