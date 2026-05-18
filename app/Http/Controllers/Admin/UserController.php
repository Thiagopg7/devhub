<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

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
            'roles' => $this->rolesPayload(),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (!$request->user()->isSuperAdmin()) {
            unset($data['is_super_admin']);
        }

        $this->userService->create($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuário criado com sucesso.');
    }

    public function edit(User $user, Request $request): Response
    {
        $current = $request->user();

        if ($user->isSuperAdmin() && !$current->isSuperAdmin()) {
            abort(403);
        }

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'is_super_admin' => $user->is_super_admin,
                'role_id'        => $user->roles->first()?->id,
            ],
            'roles' => $this->rolesPayload(),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $current = $request->user();
        $data    = $request->validated();

        if ($user->isSuperAdmin() && !$current->isSuperAdmin()) {
            abort(403);
        }

        // Bloqueios para auto-edição: usuário não pode alterar seus próprios privilégios
        $canEditPrivileges = true;
        if ($current->id === $user->id) {
            unset($data['is_super_admin'], $data['role_id']);
            $canEditPrivileges = false;
        }

        if (!$current->isSuperAdmin()) {
            unset($data['is_super_admin']);
        }

        $this->userService->update($user, $data, $canEditPrivileges);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuário atualizado com sucesso.');
    }

    public function destroy(User $user, Request $request): RedirectResponse
    {
        $current = $request->user();

        if ($current->id === $user->id) {
            return back()->withErrors(['user' => 'Você não pode excluir o próprio usuário.']);
        }

        if ($user->isSuperAdmin() && !$current->isSuperAdmin()) {
            return back()->withErrors(['user' => 'Apenas um super admin pode excluir outro super admin.']);
        }

        $this->userService->delete($user);

        return back()->with('success', 'Usuário excluído com sucesso.');
    }

    private function rolesPayload(): array
    {
        return Role::orderBy('name')->get(['id', 'name'])->toArray();
    }
}
