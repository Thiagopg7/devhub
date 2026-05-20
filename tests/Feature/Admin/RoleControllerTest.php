<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleControllerTest extends TestCase
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

    public function test_index_lista_perfis(): void
    {
        $user = $this->adminUser(['roles.view']);
        Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);

        $this->actingAs($user)
            ->get(route('admin.roles.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Roles/Index')
                ->has('roles.data')
            );
    }

    public function test_store_cria_perfil(): void
    {
        $user = $this->adminUser(['roles.create']);

        Permission::firstOrCreate(['name' => 'posts.view', 'guard_name' => 'web']);

        $this->actingAs($user)
            ->post(route('admin.roles.store'), [
                'name'        => 'Editor',
                'permissions' => ['posts.view'],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $this->assertDatabaseHas('roles', ['name' => 'Editor']);
    }

    public function test_update_renomeia_perfil(): void
    {
        $user = $this->adminUser(['roles.edit']);
        $role = Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);

        $this->actingAs($user)
            ->put(route('admin.roles.update', $role), [
                'name'        => 'Editor Sênior',
                'permissions' => [],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $this->assertDatabaseHas('roles', ['name' => 'Editor Sênior']);
    }

    public function test_destroy_remove_perfil_sem_usuarios(): void
    {
        $user = $this->adminUser(['roles.delete']);
        $role = Role::firstOrCreate(['name' => 'Temporário', 'guard_name' => 'web']);

        $this->actingAs($user)
            ->delete(route('admin.roles.destroy', $role))
            ->assertRedirect();

        $this->assertDatabaseMissing('roles', ['name' => 'Temporário']);
    }

    public function test_destroy_bloqueia_perfil_com_usuarios(): void
    {
        $user = $this->adminUser(['roles.delete']);

        $role    = Role::firstOrCreate(['name' => 'Ocupado', 'guard_name' => 'web']);
        $another = User::factory()->create();
        $another->assignRole($role);

        $this->actingAs($user)
            ->delete(route('admin.roles.destroy', $role))
            ->assertSessionHasErrors('role');

        $this->assertDatabaseHas('roles', ['name' => 'Ocupado']);
    }
}
