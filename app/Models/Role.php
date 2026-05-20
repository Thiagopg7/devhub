<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

/**
 * Role do Spatie estendida com o conceito de "perfil de sistema" (is_system).
 *
 * Um perfil de sistema é protegido: não pode ser renomeado, ter permissions
 * alteradas nem ser excluído — e está sempre com todas as permissions.
 */
class Role extends SpatieRole
{
    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'is_system' => 'boolean',
        ]);
    }

    public function isSystem(): bool
    {
        return (bool) $this->is_system;
    }
}
