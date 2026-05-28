<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageRequest;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private readonly PageService $pageService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => $this->pageService->getPaginated(20, $request->input('q')),
            'filter' => $request->only('q'),
            'trashedCount' => Page::onlyTrashed()->count(),
        ]);
    }

    public function trashed(): Response
    {
        return Inertia::render('Admin/Pages/Trashed', [
            'pages' => Page::onlyTrashed()
                ->with('deletedByUser:id,name')
                ->orderByDesc('deleted_at')
                ->paginate(20)
                ->through(fn ($p) => $p->makeVisible('deleted_at')),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        Page::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Página restaurada.', 'type' => 'success']);
    }

    public function purge(int $id): RedirectResponse
    {
        $page = Page::onlyTrashed()->findOrFail($id);
        $this->pageService->purge($page);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Página excluída permanentemente.', 'type' => 'success']);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Form');
    }

    public function store(PageRequest $request): RedirectResponse
    {
        $this->pageService->create(
            $request->validated(),
            $request->file('banner_image'),
            $request->file('main_image'),
        );

        return redirect()->route('admin.pages.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Página criada com sucesso.', 'type' => 'success']);
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => $page->load('galleryImages'),
        ]);
    }

    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $this->pageService->update(
            $page,
            $request->validated(),
            $request->file('banner_image'),
            $request->file('main_image'),
        );

        return redirect()->route('admin.pages.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Página atualizada com sucesso.', 'type' => 'success']);
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->pageService->delete($page);

        return redirect()->route('admin.pages.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Página excluída com sucesso.', 'type' => 'success']);
    }
}
