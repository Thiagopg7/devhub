<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
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

    private function systemRole(string $name = 'Administrador'): Role
    {
        $role = Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        $role->is_system = true;
        $role->save();

        return $role;
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
            ->assertSessionHas('toast.type', 'error');

        $this->assertDatabaseHas('roles', ['name' => 'Ocupado']);
    }

    public function test_update_bloqueia_perfil_de_sistema(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $role  = $this->systemRole('Administrador');

        $this->actingAs($admin)
            ->put(route('admin.roles.update', $role), ['name' => 'Hackeado', 'permissions' => []])
            ->assertForbidden();

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Administrador']);
    }

    public function test_edit_perfil_de_sistema_renderiza_em_modo_leitura(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $role  = $this->systemRole('Administrador');

        $this->actingAs($admin)
            ->get(route('admin.roles.edit', $role))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Roles/Form')
                ->where('role.is_system', true)
            );
    }

    public function test_destroy_bloqueia_perfil_de_sistema(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $role  = $this->systemRole('Administrador');

        $this->actingAs($admin)
            ->delete(route('admin.roles.destroy', $role))
            ->assertSessionHas('toast.type', 'error');

        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }

    public function test_usuario_nao_pode_editar_o_proprio_perfil(): void
    {
        $user    = $this->adminUser(['roles.edit']);
        $ownRole = Role::where('name', 'Administrador')->firstOrFail();

        $this->actingAs($user)
            ->put(route('admin.roles.update', $ownRole), ['name' => 'Turbo', 'permissions' => []])
            ->assertForbidden();

        $this->assertDatabaseHas('roles', ['id' => $ownRole->id, 'name' => 'Administrador']);
    }

    public function test_nao_super_admin_so_concede_permissoes_que_possui(): void
    {
        $user = $this->adminUser(['roles.create', 'posts.view']);

        $this->actingAs($user)
            ->post(route('admin.roles.store'), [
                'name'        => 'Editor',
                'permissions' => ['posts.view', 'users.delete'],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $editor = Role::where('name', 'Editor')->firstOrFail();
        $this->assertEqualsCanonicalizing(['posts.view'], $editor->permissions->pluck('name')->all());
    }

    public function test_super_admin_concede_qualquer_permissao(): void
    {
        $admin = User::factory()->superAdmin()->create();
        Permission::firstOrCreate(['name' => 'users.delete', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->post(route('admin.roles.store'), [
                'name'        => 'Gerente',
                'permissions' => ['users.delete'],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $role = Role::where('name', 'Gerente')->firstOrFail();
        $this->assertTrue($role->hasPermissionTo('users.delete'));
    }
}
