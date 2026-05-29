<?php

namespace Tests\Feature\Console;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_gera_token_para_o_primeiro_usuario_por_padrao(): void
    {
        $user = User::factory()->create();

        $this->artisan('api:generate-token', ['name' => 'cli'])
            ->expectsOutputToContain($user->email)
            ->assertSuccessful();

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'cli',
        ]);
    }

    public function test_localiza_usuario_por_email(): void
    {
        User::factory()->create();
        $alvo = User::factory()->create(['email' => 'api@devhub.com']);

        $this->artisan('api:generate-token', ['name' => 'cli', '--user' => 'api@devhub.com'])
            ->assertSuccessful();

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $alvo->id,
        ]);
    }

    public function test_falha_quando_usuario_nao_existe(): void
    {
        User::factory()->create();

        $this->artisan('api:generate-token', ['name' => 'cli', '--user' => 'naoexiste@devhub.com'])
            ->assertFailed();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
