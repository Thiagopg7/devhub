<?php

namespace Tests\Feature\Api;

use App\Models\Config;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConfigApiTest extends TestCase
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
        $this->getJson('/api/config')->assertUnauthorized();
    }

    public function test_retorna_grupos_publicos_e_omite_scripts(): void
    {
        Config::create(['key' => 'site_name', 'group' => 'general', 'value' => 'DevHub']);
        Config::create(['key' => 'contact_email', 'group' => 'contact', 'value' => 'oi@devhub.com']);
        Config::create(['key' => 'footer_github', 'group' => 'footer', 'value' => 'https://github.com/x']);
        Config::create(['key' => 'scripts_head', 'group' => 'scripts', 'value' => '<script>track()</script>']);

        $this->autenticado()->getJson('/api/config')
            ->assertOk()
            ->assertJsonPath('data.general.site_name', 'DevHub')
            ->assertJsonPath('data.contact.contact_email', 'oi@devhub.com')
            ->assertJsonPath('data.footer.footer_github', 'https://github.com/x')
            ->assertJsonMissingPath('data.scripts'); // grupo sensível não é exposto
    }
}
