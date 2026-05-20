<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    public function getPaginated(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = User::with('roles:id,name')->orderBy('name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'           => $data['name'],
                'email'          => $data['email'],
                'password'       => Hash::make($data['password']),
                'is_super_admin' => $data['is_super_admin'] ?? false,
            ]);

            $this->syncRole($user, $data['role_id'] ?? null);

            return $user;
        });
    }

    public function update(User $user, array $data, bool $canEditPrivileges = true): User
    {
        return DB::transaction(function () use ($user, $data, $canEditPrivileges) {
            $payload = [
                'name'  => $data['name'],
                'email' => $data['email'],
            ];

            if (!empty($data['password'])) {
                $payload['password'] = Hash::make($data['password']);
            }

            if ($canEditPrivileges && array_key_exists('is_super_admin', $data)) {
                $payload['is_super_admin'] = (bool) $data['is_super_admin'];
            }

            $user->update($payload);

            if ($canEditPrivileges) {
                $this->syncRole($user, $data['role_id'] ?? null);
            }

            return $user;
        });
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    private function syncRole(User $user, int|string|null $roleId): void
    {
        if (!$roleId) {
            $user->syncRoles([]);
            return;
        }

        $role = Role::find($roleId);
        $user->syncRoles($role ? [$role] : []);
    }
}
