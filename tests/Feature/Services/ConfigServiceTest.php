<?php

namespace Tests\Feature\Services;

use App\Models\Config;
use App\Services\ConfigService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ConfigServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(): ConfigService
    {
        return app(ConfigService::class);
    }

    // ── parseValue ────────────────────────────────────────────────────────────

    public function test_parseValue_string_vazia_retorna_null(): void
    {
        $this->assertNull($this->makeService()->parseValue(''));
    }

    public function test_parseValue_string_simples_retorna_string_raw(): void
    {
        $this->assertSame('hello', $this->makeService()->parseValue('hello'));
    }

    public function test_parseValue_json_invalido_retorna_string_raw(): void
    {
        $this->assertSame('not{valid}', $this->makeService()->parseValue('not{valid}'));
    }

    public function test_parseValue_json_valido_retorna_array(): void
    {
        $result = $this->makeService()->parseValue('{"a":1,"b":"dois"}');

        $this->assertSame(['a' => 1, 'b' => 'dois'], $result);
    }

    public function test_parseValue_null_como_json_retorna_php_null(): void
    {
        $this->assertNull($this->makeService()->parseValue('null'));
    }

    public function test_parseValue_numero_como_json_retorna_int(): void
    {
        $this->assertSame(42, $this->makeService()->parseValue('42'));
    }

    public function test_parseValue_booleano_como_json_retorna_bool(): void
    {
        $this->assertTrue($this->makeService()->parseValue('true'));
        $this->assertFalse($this->makeService()->parseValue('false'));
    }

    // ── formatValue ───────────────────────────────────────────────────────────

    public function test_formatValue_null_retorna_string_vazia(): void
    {
        $this->assertSame('', $this->makeService()->formatValue(null));
    }

    public function test_formatValue_string_retorna_mesma_string(): void
    {
        $this->assertSame('hello world', $this->makeService()->formatValue('hello world'));
    }

    public function test_formatValue_array_retorna_json_decodificavel(): void
    {
        $result = $this->makeService()->formatValue(['a' => 1]);

        $this->assertSame(['a' => 1], json_decode($result, true));
    }

    public function test_formatValue_int_retorna_representacao_json(): void
    {
        $this->assertSame('42', $this->makeService()->formatValue(42));
    }

    public function test_formatValue_bool_verdadeiro_retorna_true(): void
    {
        $this->assertSame('true', $this->makeService()->formatValue(true));
    }

    // ── cache invalidation ────────────────────────────────────────────────────

    public function test_create_invalida_cache_do_grupo(): void
    {
        Cache::put('config.site.name', 'antigo', 60);
        Cache::put('config.group.site', ['site.name' => 'antigo'], 60);

        $this->makeService()->create('site.name', 'DevHub', 'site');

        $this->assertNull(Cache::get('config.site.name'));
        $this->assertNull(Cache::get('config.group.site'));
    }

    public function test_update_invalida_cache_do_grupo_antigo_e_novo(): void
    {
        $config = Config::create(['key' => 'app.color', 'value' => 'blue', 'group' => 'app']);
        Cache::put('config.group.app', ['blue'], 60);
        Cache::put('config.group.theme', [], 60);

        $this->makeService()->update($config, 'red', 'theme');

        $this->assertNull(Cache::get('config.group.app'));
        $this->assertNull(Cache::get('config.group.theme'));
    }

    public function test_delete_invalida_cache_e_remove_registro(): void
    {
        $config = Config::create(['key' => 'site.name', 'value' => 'DevHub', 'group' => 'site']);
        Cache::put('config.site.name', 'DevHub', 60);
        Cache::put('config.group.site', ['site.name' => 'DevHub'], 60);

        $this->makeService()->delete($config);

        $this->assertNull(Cache::get('config.site.name'));
        $this->assertNull(Cache::get('config.group.site'));
        $this->assertDatabaseMissing('configs', ['key' => 'site.name']);
    }
}
