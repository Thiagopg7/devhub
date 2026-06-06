<?php

namespace Tests\Feature\Seeders;

use App\Models\User;
use Database\Seeders\PermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        foreach (['SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD', 'SEED_DEMO_EMAIL', 'SEED_DEMO_PASSWORD'] as $key) {
            putenv($key);
            unset($_ENV[$key], $_SERVER[$key]);
        }

        parent::tearDown();
    }

    private function setEnv(string $key, string $value): void
    {
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }

    public function test_aborta_em_producao_sem_credenciais(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $this->expectException(\RuntimeException::class);

        app(UserSeeder::class)->run();
    }

    public function test_em_producao_usa_credenciais_do_ambiente_e_pula_demo(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        $this->setEnv('SEED_ADMIN_EMAIL', 'admin@prod.test');
        $this->setEnv('SEED_ADMIN_PASSWORD', 'S3nh4F0rt3');

        app(PermissionsSeeder::class)->run();
        app(UserSeeder::class)->run();

        $this->assertTrue(User::where('email', 'admin@prod.test')->exists());
        $this->assertFalse(User::where('email', 'admin@teste.com.br')->exists()); // fallback não usado
        $this->assertSame(1, User::count());                                       // conta demo é pulada
    }

    public function test_em_dev_cria_admin_e_demo_com_fallback(): void
    {
        app(PermissionsSeeder::class)->run();
        app(UserSeeder::class)->run();

        $this->assertTrue(User::where('email', 'admin@teste.com.br')->exists());
        $this->assertTrue(User::where('email', 'demo@devhub.com')->exists());
        $this->assertSame(2, User::count());
    }
}
