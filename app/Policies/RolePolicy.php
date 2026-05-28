<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

/**
 * Regras de autorização sobre o recurso Role.
 *
 * ATENÇÃO: a imutabilidade de perfis de sistema (is_system) é uma invariante de
 * domínio verificada diretamente no controller, pois o Gate::before concede tudo
 * a super admins antes desta Policy ser consultada — o que contornaria qualquer
 * return false aqui para esse grupo.
 *
 * Esta Policy cobre apenas as regras baseadas no papel do usuário:
 * ninguém edita o próprio perfil, evitando auto-escalada de permissões.
 */
class RolePolicy
{
    /**
     * Quem pode abrir o formulário de edição de um perfil.
     * Perfis de sistema abrem em somente-leitura para qualquer um (is_system no
     * form desabilita o formulário). Perfis comuns bloqueiam o próprio portador
     * para evitar mostrar um form editável que seria negado no save.
     */
    public function view(User $current, Role $role): bool
    {
        if ($role->isSystem()) {
            return true;
        }

        return ! $current->hasRole($role);
    }

    /**
     * Quem pode salvar alterações em um perfil.
     * Ninguém edita o próprio perfil.
     * A imutabilidade de perfis de sistema (abort_if) é verificada no controller.
     */
    public function update(User $current, Role $role): bool
    {
        return ! $current->hasRole($role);
    }
}
