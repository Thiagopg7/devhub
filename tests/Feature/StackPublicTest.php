<?php

namespace Tests\Feature;

use App\Models\StackItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StackPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_passa_apenas_itens_ativos(): void
    {
        StackItem::factory()->create(['name' => 'Visível', 'is_active' => true]);
        StackItem::factory()->create(['name' => 'Oculto', 'is_active' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->has('stackItems', 1)
                ->where('stackItems.0.name', 'Visível')
            );
    }

    public function test_home_ordena_itens_por_order_e_nome(): void
    {
        StackItem::factory()->create(['name' => 'Beta', 'order' => 2, 'is_active' => true]);
        StackItem::factory()->create(['name' => 'Alpha', 'order' => 1, 'is_active' => true]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Home')
                ->where('stackItems.0.name', 'Alpha')
                ->where('stackItems.1.name', 'Beta')
            );
    }
}
