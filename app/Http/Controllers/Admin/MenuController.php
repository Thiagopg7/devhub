<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuRequest;
use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function __construct(private readonly MenuService $menuService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Menu/Index', [
            'items'  => $this->menuService->getAdminList($request->input('q')),
            'filter' => $request->only('q'),
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
        $this->menuService->create($request->validated());

        return redirect()->route('admin.menu.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Item criado com sucesso.', 'type' => 'success']);
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
        $this->menuService->update($menu, $request->validated());

        return redirect()->route('admin.menu.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Item atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(MenuItem $menu): RedirectResponse
    {
        if ($menu->children()->exists()) {
            return back()->withErrors(['menu' => 'Remova os submenus antes de excluir este item.']);
        }

        $this->menuService->delete($menu);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Item excluído com sucesso.', 'type' => 'success']);
    }
}
