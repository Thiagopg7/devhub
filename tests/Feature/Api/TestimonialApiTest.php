<?php

namespace Tests\Feature\Api;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialApiTest extends TestCase
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
        $this->getJson('/api/testimonials')->assertUnauthorized();
    }

    public function test_retorna_apenas_ativos_ordenados(): void
    {
        Testimonial::factory()->create(['name' => 'Beta', 'order' => 2, 'is_active' => true]);
        Testimonial::factory()->create(['name' => 'Alpha', 'order' => 1, 'is_active' => true]);
        Testimonial::factory()->create(['name' => 'Oculto', 'is_active' => false]);

        $this->autenticado()->getJson('/api/testimonials')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Alpha')
            ->assertJsonPath('data.1.name', 'Beta');
    }
}
