<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Services\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

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
        $this->roleService->create($request->validated());

        return redirect()->route('admin.roles.index')
            ->with('success', 'Perfil criado com sucesso.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $this->roleService->update($role, $request->validated());

        return redirect()->route('admin.roles.index')
            ->with('success', 'Perfil atualizado com sucesso.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->users()->exists()) {
            return back()->withErrors(['role' => 'Existem usuários vinculados a este perfil.']);
        }

        $this->roleService->delete($role);

        return back()->with('success', 'Perfil excluído com sucesso.');
    }
}
