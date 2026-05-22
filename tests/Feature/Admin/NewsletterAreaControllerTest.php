<?php

namespace Tests\Feature\Admin;

use App\Models\NewsletterArea;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class NewsletterAreaControllerTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(array $perms = []): User
    {
        $role = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);

        foreach ($perms as $name) {
            $perm = Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            $role->givePermissionTo($perm);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    public function test_index_lista_areas(): void
    {
        $user = $this->adminUser(['newsletter_areas.view']);
        NewsletterArea::create(['name' => 'Tecnologia', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.newsletter-areas.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/NewsletterAreas/Index')
                ->has('areas.data')
            );
    }

    public function test_store_cria_area(): void
    {
        $user = $this->adminUser(['newsletter_areas.create']);

        $this->actingAs($user)
            ->post(route('admin.newsletter-areas.store'), [
                'name'      => 'Carreira',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.newsletter-areas.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('newsletter_areas', ['name' => 'Carreira']);
    }

    public function test_store_define_order_automaticamente(): void
    {
        $user = $this->adminUser(['newsletter_areas.create']);
        NewsletterArea::create(['name' => 'Primeira', 'order' => 1, 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.newsletter-areas.store'), [
                'name'      => 'Segunda',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('newsletter_areas', ['name' => 'Segunda', 'order' => 2]);
    }

    public function test_update_atualiza_area(): void
    {
        $user = $this->adminUser(['newsletter_areas.edit']);
        $area = NewsletterArea::create(['name' => 'Antiga', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.newsletter-areas.update', $area), [
                'name'      => 'Atualizada',
                'is_active' => false,
            ])
            ->assertRedirect(route('admin.newsletter-areas.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('newsletter_areas', ['id' => $area->id, 'name' => 'Atualizada']);
    }

    public function test_destroy_remove_area(): void
    {
        $user = $this->adminUser(['newsletter_areas.delete']);
        $area = NewsletterArea::create(['name' => 'Remover', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.newsletter-areas.destroy', $area))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('newsletter_areas', ['id' => $area->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.newsletter-areas.index'))
            ->assertRedirect(route('login'));
    }
}
