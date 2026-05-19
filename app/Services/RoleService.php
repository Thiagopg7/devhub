<?php

namespace App\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = Role::withCount(['permissions', 'users'])->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
            $role->syncPermissions($this->filterPermissions($data['permissions'] ?? []));

            return $role;
        });
    }

    public function update(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update(['name' => $data['name']]);
            $role->syncPermissions($this->filterPermissions($data['permissions'] ?? []));

            return $role;
        });
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }

    /**
     * Mantém apenas permissions que pertencem aos módulos×ações cadastrados no config.
     * Defesa em profundidade: front pode mandar qualquer string.
     */
    private function filterPermissions(array $names): array
    {
        $modules = array_keys(Config::get('permissions.modules', []));
        $actions = Config::get('permissions.actions', []);

        $valid = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $valid[] = "{$module}.{$action}";
            }
        }

        return array_values(array_intersect($valid, $names));
    }
}
