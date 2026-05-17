<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageRequest;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private readonly PageService $pageService) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => $this->pageService->getPaginated(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Form');
    }

    public function store(PageRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->pageService->create(
            $data,
            $request->file('banner_image'),
            $request->file('main_image'),
        );

        return redirect()->route('admin.pages.index')
            ->with('success', 'Página criada com sucesso.');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => $page->load('galleryImages'),
        ]);
    }

    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $data = $request->validated();

        $this->pageService->update(
            $page,
            $data,
            $request->file('banner_image'),
            $request->file('main_image'),
        );

        return redirect()->route('admin.pages.index')
            ->with('success', 'Página atualizada com sucesso.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->pageService->delete($page);

        return redirect()->route('admin.pages.index')
            ->with('success', 'Página excluída com sucesso.');
    }

    public function deleteBanner(Page $page): RedirectResponse
    {
        $this->pageService->deleteBanner($page);

        return back();
    }

    public function deleteMainImage(Page $page): RedirectResponse
    {
        $this->pageService->deleteMainImage($page);

        return back();
    }
}
