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

    public function index(): Response
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $this->roleService->getPaginated(20, request()->input('q')),
            'filter' => request()->only('q'),
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

    public function edit(Role $role): Response
    {
        // RolePolicy::view — sistema sempre abre (somente-leitura); não-sistema bloqueia o próprio portador.
        $this->authorize('view', $role);

        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
                'is_system' => $role->isSystem(),
            ],
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        // Invariante de domínio: perfis de sistema são imutáveis para todos,
        // incluindo super admins (Gate::before não pode cobrir isso).
        abort_if($role->isSystem(), 403, 'Perfil de sistema não pode ser alterado.');

        // Autorização delegada a RolePolicy via RoleRequest::authorize().
        $this->roleService->update($role, $this->capPermissions($request->validated(), $request->user()));

        return redirect()->route('admin.roles.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(Role $role, Request $request): RedirectResponse
    {
        // Invariante de domínio: imutável para todos, incluindo super admins.
        if ($role->isSystem()) {
            return back()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Este é um perfil de sistema e não pode ser excluído.',
                'type' => 'error',
            ]);
        }

        if ($role->users()->exists()) {
            return back()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Existem usuários vinculados a este perfil.',
                'type' => 'error',
            ]);
        }

        $this->roleService->delete($role);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil excluído com sucesso.', 'type' => 'success']);
    }

    private function capPermissions(array $data, User $current): array
    {
        if (! $current->isSuperAdmin()) {
            $allowed = $current->getAllPermissions()->pluck('name')->all();
            $data['permissions'] = array_values(array_intersect($data['permissions'] ?? [], $allowed));
        }

        return $data;
    }
}
