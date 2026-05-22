<?php

namespace Tests\Feature\Admin;

use App\Models\MenuItem;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MenuControllerTest extends TestCase
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

    public function test_index_lista_itens(): void
    {
        $user = $this->adminUser(['menu.view']);
        MenuItem::create(['label' => 'Início', 'url' => '/', 'is_active' => true]);

        $this->actingAs($user)
            ->get(route('admin.menu.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Menu/Index'));
    }

    public function test_store_cria_item_raiz(): void
    {
        $user = $this->adminUser(['menu.create']);

        $this->actingAs($user)
            ->post(route('admin.menu.store'), [
                'label'     => 'Blog',
                'url'       => '/blog',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.menu.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('menu_items', ['label' => 'Blog', 'parent_id' => null]);
    }

    public function test_store_cria_submenu(): void
    {
        $user   = $this->adminUser(['menu.create']);
        $parent = MenuItem::create(['label' => 'Sobre', 'url' => '/sobre', 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.menu.store'), [
                'label'     => 'A empresa',
                'url'       => '/sobre/empresa',
                'parent_id' => $parent->id,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.menu.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('menu_items', ['label' => 'A empresa', 'parent_id' => $parent->id]);
    }

    public function test_store_bloqueia_terceiro_nivel(): void
    {
        $user   = $this->adminUser(['menu.create']);
        $root   = MenuItem::create(['label' => 'Raiz', 'url' => '/raiz', 'is_active' => true]);
        $child  = MenuItem::create(['label' => 'Filho', 'url' => '/filho', 'parent_id' => $root->id, 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('admin.menu.store'), [
                'label'     => 'Neto',
                'url'       => '/neto',
                'parent_id' => $child->id,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('parent_id');
    }

    public function test_update_atualiza_item(): void
    {
        $user = $this->adminUser(['menu.edit']);
        $item = MenuItem::create(['label' => 'Velho', 'url' => '/velho', 'is_active' => true]);

        $this->actingAs($user)
            ->put(route('admin.menu.update', $item), [
                'label'     => 'Novo',
                'url'       => '/novo',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.menu.index'))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseHas('menu_items', ['id' => $item->id, 'label' => 'Novo']);
    }

    public function test_destroy_com_filhos_retorna_erro(): void
    {
        $user   = $this->adminUser(['menu.delete']);
        $parent = MenuItem::create(['label' => 'Pai', 'url' => '/pai', 'is_active' => true]);
        MenuItem::create(['label' => 'Filho', 'url' => '/filho', 'parent_id' => $parent->id, 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.menu.destroy', $parent))
            ->assertSessionHas('toast.type', 'error');

        $this->assertDatabaseHas('menu_items', ['id' => $parent->id]);
    }

    public function test_destroy_sem_filhos_remove_item(): void
    {
        $user = $this->adminUser(['menu.delete']);
        $item = MenuItem::create(['label' => 'Folha', 'url' => '/folha', 'is_active' => true]);

        $this->actingAs($user)
            ->delete(route('admin.menu.destroy', $item))
            ->assertSessionHas('toast.type', 'success');

        $this->assertDatabaseMissing('menu_items', ['id' => $item->id]);
    }

    public function test_acesso_sem_autenticacao_redireciona(): void
    {
        $this->get(route('admin.menu.index'))
            ->assertRedirect(route('login'));
    }
}
