<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsletterAreaRequest;
use App\Models\NewsletterArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterAreaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('q');

        $areas = NewsletterArea::ordered()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/NewsletterAreas/Index', [
            'areas' => $areas,
            'filter' => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/NewsletterAreas/Form');
    }

    public function store(NewsletterAreaRequest $request): RedirectResponse
    {
        NewsletterArea::create($request->validated());

        return redirect()->route('admin.newsletter-areas.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Área criada com sucesso.', 'type' => 'success']);
    }

    public function edit(NewsletterArea $newsletterArea): Response
    {
        return Inertia::render('Admin/NewsletterAreas/Form', [
            'area' => $newsletterArea,
        ]);
    }

    public function update(NewsletterAreaRequest $request, NewsletterArea $newsletterArea): RedirectResponse
    {
        $newsletterArea->update($request->validated());

        return redirect()->route('admin.newsletter-areas.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Área atualizada com sucesso.', 'type' => 'success']);
    }

    public function destroy(NewsletterArea $newsletterArea): RedirectResponse
    {
        $newsletterArea->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Área excluída com sucesso.', 'type' => 'success']);
    }
}
