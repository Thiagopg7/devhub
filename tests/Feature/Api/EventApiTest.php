<?php

namespace Tests\Feature\Api;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->token = User::factory()->create()->createToken('api-test')->plainTextToken;
    }

    private function autenticado(): static
    {
        return $this->withToken($this->token);
    }

    public function test_exige_autenticacao(): void
    {
        $this->getJson('/api/events')->assertUnauthorized();
    }

    public function test_retorna_apenas_eventos_ativos(): void
    {
        Event::factory()->count(2)->create(['is_active' => true]);
        Event::factory()->inactive()->create();

        $this->autenticado()->getJson('/api/events')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_filtra_proximos_e_passados(): void
    {
        Event::factory()->create(['title' => 'Futuro', 'date' => now()->addWeek()->format('Y-m-d')]);
        Event::factory()->create(['title' => 'Passado', 'date' => now()->subWeek()->format('Y-m-d')]);

        $this->autenticado()->getJson('/api/events?when=upcoming')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Futuro');

        $this->autenticado()->getJson('/api/events?when=past')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Passado');
    }

    public function test_filtra_por_tipo(): void
    {
        Event::factory()->create(['type' => 'workshop']);
        Event::factory()->create(['type' => 'conf']);

        $this->autenticado()->getJson('/api/events?type=workshop')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'workshop');
    }
}
