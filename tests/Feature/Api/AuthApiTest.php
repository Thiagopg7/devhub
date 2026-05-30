<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_retorna_token_e_dados_do_usuario(): void
    {
        $user = User::factory()->create(['password' => bcrypt('senha123')]);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha123',
        ])
            ->assertOk()
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email'],
            ])
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_login_nao_abre_sessao(): void
    {
        $user = User::factory()->create(['password' => bcrypt('senha123')]);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'senha123',
        ])->assertOk();

        $this->assertGuest();
    }

    public function test_login_rejeita_credenciais_invalidas(): void
    {
        User::factory()->create(['email' => 'user@exemplo.com']);

        $this->postJson('/api/auth/login', [
            'email' => 'user@exemplo.com',
            'password' => 'senha-errada',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_valida_campos_obrigatorios(): void
    {
        $this->postJson('/api/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_retorna_dados_do_usuario_autenticado(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $user->id,
                'email' => $user->email,
            ])
            ->assertJsonStructure(['id', 'name', 'email', 'is_super_admin', 'roles', 'permissions']);
    }

    public function test_me_requer_autenticacao(): void
    {
        $this->getJson('/api/auth/me')
            ->assertUnauthorized();
    }

    public function test_logout_revoga_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJson(['message' => 'Sessão encerrada com sucesso.']);

        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
    }

    public function test_logout_requer_autenticacao(): void
    {
        $this->postJson('/api/auth/logout')
            ->assertUnauthorized();
    }
}
