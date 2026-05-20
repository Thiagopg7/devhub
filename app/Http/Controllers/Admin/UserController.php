<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'users'  => $this->userService->getPaginated(20, $request->input('q')),
            'filter' => $request->only('q'),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'roles' => $this->rolesPayload($request->user()),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $current = $request->user();
        $data    = $request->validated();

        if (!$current->isSuperAdmin()) {
            unset($data['is_super_admin']);

            if ($this->isSystemRole($data['role_id'] ?? null)) {
                return back()->withErrors(['role_id' => 'Apenas um super admin pode atribuir um perfil de sistema.']);
            }
        }

        $this->userService->create($data);

        return redirect()->route('admin.users.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Usuário criado com sucesso.', 'type' => 'success']);
    }

    public function edit(User $user, Request $request): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'is_super_admin' => $user->is_super_admin,
                'role_id'        => $user->roles->first()?->id,
            ],
            'roles' => $this->rolesPayload($request->user()),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        // Autorização delegada a UserPolicy via UserRequest::authorize().
        $current = $request->user();
        $data    = $request->validated();

        // Auto-edição: o usuário não pode alterar os próprios privilégios.
        $canEditPrivileges = true;
        if ($current->id === $user->id) {
            unset($data['is_super_admin'], $data['role_id']);
            $canEditPrivileges = false;
        }

        if (!$current->isSuperAdmin()) {
            unset($data['is_super_admin']);

            if ($canEditPrivileges && $this->isSystemRole($data['role_id'] ?? null)) {
                return back()->withErrors(['role_id' => 'Apenas um super admin pode atribuir um perfil de sistema.']);
            }
        }

        $this->userService->update($user, $data, $canEditPrivileges);

        return redirect()->route('admin.users.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Usuário atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(User $user, Request $request): RedirectResponse
    {
        $current = $request->user();

        if (!$current->can('delete', $user)) {
            $message = $current->id === $user->id
                ? 'Você não pode excluir o próprio usuário.'
                : 'Apenas um super admin pode excluir um usuário administrador.';

            return back()->withErrors(['user' => $message]);
        }

        $this->userService->delete($user);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Usuário excluído com sucesso.', 'type' => 'success']);
    }

    private function rolesPayload(User $current): array
    {
        $query = Role::orderBy('name');

        if (!$current->isSuperAdmin()) {
            $query->where('is_system', false);
        }

        return $query->get(['id', 'name', 'is_system'])->toArray();
    }

    private function isSystemRole(int|string|null $roleId): bool
    {
        return $roleId !== null
            && Role::whereKey($roleId)->where('is_system', true)->exists();
    }
}
