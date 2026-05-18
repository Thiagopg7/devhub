<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $modules = array_keys(Config::get('permissions.modules', []));
        $actions = Config::get('permissions.actions', []);

        $all = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $name  = "{$module}.{$action}";
                $all[] = $name;
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            }
        }

        $admin = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);
        $admin->syncPermissions($all);
    }
}
