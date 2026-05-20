<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class UserControllerTest extends TestCase
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

    private function systemRole(string $name = 'Sistema'): Role
    {
        $role = Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        $role->is_system = true;
        $role->save();

        return $role;
    }

    public function test_index_lista_usuarios(): void
    {
        $user = $this->adminUser(['users.view']);

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Users/Index')
                ->has('users.data')
            );
    }

    public function test_store_cria_usuario(): void
    {
        $user = $this->adminUser(['users.create']);

        $this->actingAs($user)
            ->post(route('admin.users.store'), [
                'name'                  => 'Novo Usuário',
                'email'                 => 'novo@exemplo.com',
                'password'              => 'senha123456',
                'password_confirmation' => 'senha123456',
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', ['email' => 'novo@exemplo.com']);
    }

    public function test_update_edita_usuario(): void
    {
        $admin  = $this->adminUser(['users.edit']);
        $target = User::factory()->create(['name' => 'Antigo Nome']);

        $this->actingAs($admin)
            ->put(route('admin.users.update', $target), [
                'name'  => 'Novo Nome',
                'email' => $target->email,
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', ['id' => $target->id, 'name' => 'Novo Nome']);
    }

    public function test_destroy_remove_usuario(): void
    {
        $admin  = $this->adminUser(['users.delete']);
        $target = User::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $target))
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_destroy_nao_permite_auto_exclusao(): void
    {
        $user = $this->adminUser(['users.delete']);

        $this->actingAs($user)
            ->delete(route('admin.users.destroy', $user))
            ->assertSessionHasErrors('user');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_usuario_nao_pode_editar_proprios_privilegios(): void
    {
        $role = Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);
        $user = $this->adminUser(['users.edit']);

        $this->actingAs($user)
            ->put(route('admin.users.update', $user), [
                'name'           => $user->name,
                'email'          => $user->email,
                'is_super_admin' => true,
                'role_id'        => $role->id,
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertFalse($user->fresh()->is_super_admin);
    }

    public function test_nao_super_admin_nao_pode_excluir_super_admin(): void
    {
        $admin  = $this->adminUser(['users.delete']);
        $target = User::factory()->superAdmin()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $target))
            ->assertSessionHasErrors('user');

        $this->assertDatabaseHas('users', ['id' => $target->id]);
    }

    public function test_nao_super_admin_nao_pode_excluir_usuario_com_perfil_de_sistema(): void
    {
        $admin  = $this->adminUser(['users.delete']);
        $target = User::factory()->create();
        $target->assignRole($this->systemRole());

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $target))
            ->assertSessionHasErrors('user');

        $this->assertDatabaseHas('users', ['id' => $target->id]);
    }

    public function test_super_admin_pode_excluir_super_admin(): void
    {
        $admin  = User::factory()->superAdmin()->create();
        $target = User::factory()->superAdmin()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $target))
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_nao_super_admin_nao_pode_editar_super_admin(): void
    {
        $admin  = $this->adminUser(['users.edit']);
        $target = User::factory()->superAdmin()->create();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $target), [
                'name'  => 'Nome Alterado',
                'email' => $target->email,
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('users', ['id' => $target->id, 'name' => $target->name]);
    }

    public function test_nao_super_admin_nao_pode_atribuir_perfil_de_sistema(): void
    {
        $admin = $this->adminUser(['users.create']);
        $role  = $this->systemRole();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name'                  => 'Intruso',
                'email'                 => 'intruso@exemplo.com',
                'password'              => 'senha123456',
                'password_confirmation' => 'senha123456',
                'role_id'               => $role->id,
            ])
            ->assertSessionHasErrors('role_id');

        $this->assertDatabaseMissing('users', ['email' => 'intruso@exemplo.com']);
    }

    public function test_super_admin_pode_atribuir_perfil_de_sistema(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $role  = $this->systemRole();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name'                  => 'Novo Admin',
                'email'                 => 'novoadmin@exemplo.com',
                'password'              => 'senha123456',
                'password_confirmation' => 'senha123456',
                'role_id'               => $role->id,
            ])
            ->assertRedirect(route('admin.users.index'));

        $created = User::where('email', 'novoadmin@exemplo.com')->firstOrFail();
        $this->assertTrue($created->hasRole($role));
    }
}
