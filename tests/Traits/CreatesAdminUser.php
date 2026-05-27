<?php

namespace Tests\Traits;

use App\Models\Role;
use App\Models\User;
use Spatie\Permission\Models\Permission;

trait CreatesAdminUser
{
    protected function adminUser(array $perms = []): User
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

    protected function systemRole(string $name = 'Sistema'): Role
    {
        $role = Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        $role->is_system = true;
        $role->save();

        return $role;
    }
}
