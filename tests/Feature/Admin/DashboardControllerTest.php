<?php

namespace Tests\Feature\Admin;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class DashboardControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_renderiza_componente_dashboard(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
    }

    public function test_index_retorna_props_esperadas(): void
    {
        $user = $this->adminUser();
        Post::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->has('stats')
                ->has('stats.posts')
                ->has('stats.users')
                ->has('stats.subscribers')
                ->has('stats.campaigns')
                ->has('postsPerMonth')
                ->has('recentActivity')
            );
    }

    public function test_posts_per_month_tem_seis_entradas(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('postsPerMonth', 6));
    }

    public function test_acesso_sem_autenticacao_redireciona_para_login(): void
    {
        $this->get(route('admin.dashboard'))
            ->assertRedirect(route('login'));
    }

    public function test_acesso_sem_role_redireciona(): void
    {
        // O exception handler converte 403 GET em redirect para o dashboard
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertRedirect(route('admin.dashboard'));
    }
}
