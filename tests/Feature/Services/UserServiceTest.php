<?php

namespace Tests\Feature\Services;

use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->make(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function makeService(): UserService
    {
        return app(UserService::class);
    }

    private function makeRole(string $name = 'Editor'): Role
    {
        return Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
    }

    public function test_create_cria_usuario_com_senha_hasheada(): void
    {
        $user = $this->makeService()->create([
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'secret123',
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertDatabaseHas('users', ['email' => 'joao@example.com']);
        $this->assertTrue(Hash::check('secret123', $user->password));
    }

    public function test_create_associa_role_quando_fornecida(): void
    {
        $role = $this->makeRole();

        $user = $this->makeService()->create([
            'name' => 'Maria',
            'email' => 'maria@example.com',
            'password' => 'secret',
            'role_id' => $role->id,
        ]);

        $this->assertTrue($user->hasRole($role->name));
    }

    public function test_create_sem_role_nao_atribui_nenhuma(): void
    {
        $user = $this->makeService()->create([
            'name' => 'Sem Role',
            'email' => 'semrole@example.com',
            'password' => 'secret',
        ]);

        $this->assertEmpty($user->roles);
    }

    public function test_create_aceita_is_super_admin_de_data(): void
    {
        $user = $this->makeService()->create([
            'name' => 'Super',
            'email' => 'super@example.com',
            'password' => 'secret',
            'is_super_admin' => true,
        ]);

        $this->assertTrue((bool) $user->fresh()->is_super_admin);
    }

    public function test_create_com_role_inexistente_nao_atribui_nenhuma_role(): void
    {
        $user = $this->makeService()->create([
            'name' => 'Orphan',
            'email' => 'orphan@example.com',
            'password' => 'secret',
            'role_id' => 99999,
        ]);

        $this->assertEmpty($user->roles);
    }

    public function test_update_altera_nome_e_email(): void
    {
        $user = User::factory()->create();

        $this->makeService()->update($user, [
            'name' => 'Atualizado',
            'email' => 'atualizado@example.com',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Atualizado',
            'email' => 'atualizado@example.com',
        ]);
    }

    public function test_update_altera_senha_quando_fornecida(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old')]);

        $this->makeService()->update($user, [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'newpassword',
        ]);

        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
    }

    public function test_update_mantem_senha_quando_nao_fornecida(): void
    {
        $original = Hash::make('unchanged');
        $user = User::factory()->create(['password' => $original]);

        $this->makeService()->update($user, [
            'name' => $user->name,
            'email' => $user->email,
        ]);

        $this->assertSame($original, $user->fresh()->password);
    }

    public function test_update_nao_altera_privilegios_quando_canEditPrivileges_false(): void
    {
        $role = $this->makeRole('Editor');
        $other = $this->makeRole('Viewer');
        $user = User::factory()->create(['is_super_admin' => false]);
        $user->syncRoles([$role]);

        $this->makeService()->update($user, [
            'name' => $user->name,
            'email' => $user->email,
            'is_super_admin' => true,
            'role_id' => $other->id,
        ], canEditPrivileges: false);

        $user->refresh();
        $this->assertFalse((bool) $user->is_super_admin);
        $this->assertTrue($user->hasRole('Editor'));
        $this->assertFalse($user->hasRole('Viewer'));
    }

    public function test_update_altera_privilegios_quando_canEditPrivileges_true(): void
    {
        $role = $this->makeRole('Editor');
        $other = $this->makeRole('Reviewer');
        $user = User::factory()->create(['is_super_admin' => false]);
        $user->syncRoles([$role]);

        $this->makeService()->update($user, [
            'name' => $user->name,
            'email' => $user->email,
            'is_super_admin' => true,
            'role_id' => $other->id,
        ], canEditPrivileges: true);

        $user->refresh();
        $this->assertTrue((bool) $user->is_super_admin);
        $this->assertFalse($user->hasRole('Editor'));
        $this->assertTrue($user->hasRole('Reviewer'));
    }

    public function test_delete_remove_usuario(): void
    {
        $user = User::factory()->create();

        $this->makeService()->delete($user);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
