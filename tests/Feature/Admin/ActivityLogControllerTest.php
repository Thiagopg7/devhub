<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class ActivityLogControllerTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_index_renderiza_componente_correto(): void
    {
        $user = $this->adminUser(['activity_log.view']);

        $this->actingAs($user)
            ->get(route('admin.activity-log.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/ActivityLog/Index')
                ->has('items')
                ->has('filters')
                ->has('events')
                ->has('perPageOptions')
            );
    }

    public function test_index_lista_registros_de_atividade(): void
    {
        $user = $this->adminUser(['activity_log.view']);

        activity()->log('Ação de teste');

        $this->actingAs($user)
            ->get(route('admin.activity-log.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('items.data')
                ->where('items.total', fn ($v) => $v >= 1)
            );
    }

    public function test_filtro_por_event_retorna_apenas_registros_correspondentes(): void
    {
        $user = $this->adminUser(['activity_log.view']);

        // 'restored' não é gerado automaticamente pelo setup do adminUser()
        activity()->event('restored')->log('Restauração');
        activity()->event('deleted')->log('Exclusão');

        $this->actingAs($user)
            ->get(route('admin.activity-log.index', ['event' => 'restored']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('items.data', 1)
                ->where('filters.event', 'restored')
            );
    }

    public function test_filtro_por_search_retorna_resultados_correspondentes(): void
    {
        $user = $this->adminUser(['activity_log.view']);

        activity()->log('Descrição única');
        activity()->log('Outra entrada');

        $this->actingAs($user)
            ->get(route('admin.activity-log.index', ['search' => 'única']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('items.data', 1));
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.activity-log.index'))
            ->assertRedirect(route('login'));
    }

    public function test_acesso_sem_permissao_redireciona(): void
    {
        // O exception handler converte 403 GET em redirect para o dashboard
        $user = $this->adminUser();

        $this->actingAs($user)
            ->get(route('admin.activity-log.index'))
            ->assertRedirect(route('admin.dashboard'));
    }
}
