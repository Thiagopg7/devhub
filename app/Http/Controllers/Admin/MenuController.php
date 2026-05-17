<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuRequest;
use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function __construct(private readonly MenuService $menuService) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Menu/Index', [
            'items' => $this->menuService->getAdminList(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Menu/Form', [
            'roots' => $this->menuService->getRoots(),
        ]);
    }

    public function store(MenuRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($data['parent_id'] ?? null) {
            $parent = MenuItem::find($data['parent_id']);
            if ($parent?->parent_id !== null) {
                return back()->withErrors(['parent_id' => 'Não é possível criar mais de dois níveis de menu.']);
            }
        }

        $this->menuService->create($data);

        return redirect()->route('admin.menu.index')
            ->with('success', 'Item criado com sucesso.');
    }

    public function edit(MenuItem $menu): Response
    {
        return Inertia::render('Admin/Menu/Form', [
            'item'  => $menu,
            'roots' => $this->menuService->getRoots()->where('id', '!=', $menu->id)->values(),
        ]);
    }

    public function update(MenuRequest $request, MenuItem $menu): RedirectResponse
    {
        $data = $request->validated();

        if ($data['parent_id'] ?? null) {
            $parent = MenuItem::find($data['parent_id']);
            if ($parent?->parent_id !== null) {
                return back()->withErrors(['parent_id' => 'Não é possível criar mais de dois níveis de menu.']);
            }
            if ($menu->children()->exists()) {
                return back()->withErrors(['parent_id' => 'Este item possui submenus e não pode se tornar um submenu.']);
            }
        }

        $this->menuService->update($menu, $data);

        return redirect()->route('admin.menu.index')
            ->with('success', 'Item atualizado com sucesso.');
    }

    public function destroy(MenuItem $menu): RedirectResponse
    {
        if ($menu->children()->exists()) {
            return back()->withErrors(['menu' => 'Remova os submenus antes de excluir este item.']);
        }

        $this->menuService->delete($menu);

        return back()->with('success', 'Item excluído com sucesso.');
    }
}
