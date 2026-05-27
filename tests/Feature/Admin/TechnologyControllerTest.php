<?php

namespace Tests\Feature\Admin;

use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\CreatesAdminUser;

class TechnologyControllerTest extends TestCase
{
    use CreatesAdminUser;

    use RefreshDatabase;

    public function test_index_lista_tecnologias(): void
    {
        $user = $this->adminUser(['technologies.view']);
        Technology::create(['name' => 'Laravel', 'url' => 'https://laravel.com', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.technologies.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Technologies/Index')
                ->has('technologies.data')
            );
    }

    public function test_store_cria_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.create']);

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name'      => 'Vue.js',
                'url'       => 'https://vuejs.org',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.technologies.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('technologies', ['name' => 'Vue.js']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['technologies.create']);
        Technology::create(['name' => 'A', 'url' => 'https://a.com', 'order' => 1]);

        $this->actingAs($user)
            ->post(route('admin.technologies.store'), [
                'name'      => 'B',
                'url'       => 'https://b.com',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('technologies', ['name' => 'B', 'order' => 2]);
    }

    public function test_update_atualiza_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.edit']);
        $tech = Technology::create(['name' => 'React', 'url' => 'https://react.dev', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.technologies.update', $tech), [
                'name'      => 'React 19',
                'url'       => 'https://react.dev',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.technologies.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('technologies', ['id' => $tech->id, 'name' => 'React 19']);
    }

    public function test_destroy_remove_tecnologia(): void
    {
        $user = $this->adminUser(['technologies.delete']);
        $tech = Technology::create(['name' => 'Removida', 'url' => 'https://x.com', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.technologies.destroy', $tech))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('technologies', ['id' => $tech->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.technologies.index'))
            ->assertRedirect(route('login'));
    }
}
