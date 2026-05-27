<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValidateApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_rejeita_requisicao_sem_token(): void
    {
        $this->getJson('/api/posts')
             ->assertUnauthorized();
    }

    public function test_rejeita_token_invalido(): void
    {
        $this->withToken('token-invalido-qualquer')
             ->getJson('/api/posts')
             ->assertUnauthorized();
    }

    public function test_aceita_token_sanctum_valido(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('api-test')->plainTextToken;

        $this->withToken($token)
             ->getJson('/api/posts')
             ->assertOk();
    }
}
