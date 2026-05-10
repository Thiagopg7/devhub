<?php

namespace Tests\Feature\Api;

use App\Models\ApiToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValidateApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_rejeita_requisicao_sem_token(): void
    {
        $response = $this->getJson('/api/posts');

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Token não informado.']);
    }

    public function test_rejeita_token_invalido(): void
    {
        $response = $this->withToken('token-invalido')
                         ->getJson('/api/posts');

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Token inválido ou expirado.']);
    }

    public function test_rejeita_token_expirado(): void
    {
        $plainToken = 'token-expirado-123';

        ApiToken::factory()->create([
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->withToken($plainToken)
                         ->getJson('/api/posts');

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Token inválido ou expirado.']);
    }

    public function test_aceita_token_valido(): void
    {
        $plainToken = 'token-valido-123';

        ApiToken::factory()->create([
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => null,
        ]);

        $response = $this->withToken($plainToken)
                         ->getJson('/api/posts');

        $response->assertStatus(200);
    }
}
