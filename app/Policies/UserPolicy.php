<?php

namespace App\Policies;

use App\Models\User;

/**
 * Regras de autorização sobre o recurso User.
 *
 * O Gate::before em AppServiceProvider já concede tudo a super admins antes de
 * qualquer método desta classe ser chamado, então os métodos abaixo tratam apenas
 * o caso de usuários comuns.
 */
class UserPolicy
{
    /**
     * Quem pode abrir o formulário de edição de um usuário.
     * Mesma regra de update: o form só abre se a gravação seria permitida.
     */
    public function view(User $current, User $target): bool
    {
        return $this->update($current, $target);
    }

    /**
     * Quem pode editar um usuário.
     * Usuários privilegiados (super admin ou com perfil de sistema) só podem ser
     * editados por um super admin.
     */
    public function update(User $current, User $target): bool
    {
        if ($current->id === $target->id) {
            return false;
        }

        if ($target->isPrivileged()) {
            return $current->isSuperAdmin();
        }

        return true;
    }

    /**
     * Quem pode excluir um usuário.
     */
    public function delete(User $current, User $target): bool
    {
        if ($current->id === $target->id) {
            return false;
        }

        if ($target->isPrivileged()) {
            return $current->isSuperAdmin();
        }

        return true;
    }
}
