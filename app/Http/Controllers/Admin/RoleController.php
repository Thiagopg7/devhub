<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(private readonly RoleService $roleService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles'  => $this->roleService->getPaginated(20, $request->input('q')),
            'filter' => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Form');
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        $this->roleService->create($this->capPermissions($request->validated(), $request->user()));

        return redirect()->route('admin.roles.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil criado com sucesso.', 'type' => 'success']);
    }

    public function edit(Role $role, Request $request): Response
    {
        // Perfis de sistema podem ser abertos apenas em modo leitura (is_system).
        $this->assertNotOwnRole($role, $request->user());

        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
                'is_system'   => $role->isSystem(),
            ],
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        abort_if($role->isSystem(), 403, 'Perfil de sistema não pode ser alterado.');
        $this->assertNotOwnRole($role, $request->user());

        $this->roleService->update($role, $this->capPermissions($request->validated(), $request->user()));

        return redirect()->route('admin.roles.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->isSystem()) {
            return back()->withErrors(['role' => 'Este é um perfil de sistema e não pode ser excluído.']);
        }

        if ($role->users()->exists()) {
            return back()->withErrors(['role' => 'Existem usuários vinculados a este perfil.']);
        }

        $this->roleService->delete($role);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil excluído com sucesso.', 'type' => 'success']);
    }

    /**
     * Ninguém (exceto super admin) pode editar o próprio perfil — evita auto-escalada
     * de privilégios (conceder permissões a si mesmo).
     */
    private function assertNotOwnRole(Role $role, User $current): void
    {
        abort_if(
            !$current->isSuperAdmin() && $current->hasRole($role),
            403,
            'Você não pode editar o próprio perfil.'
        );
    }

    /**
     * Um usuário não-super-admin só pode conceder a um perfil as permissions
     * que ele próprio possui — não pode criar/editar perfis mais poderosos que ele.
     */
    private function capPermissions(array $data, User $current): array
    {
        if (!$current->isSuperAdmin()) {
            $allowed = $current->getAllPermissions()->pluck('name')->all();
            $data['permissions'] = array_values(array_intersect($data['permissions'] ?? [], $allowed));
        }

        return $data;
    }
}
