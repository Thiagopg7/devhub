<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsletterAreaRequest;
use App\Models\NewsletterArea;
use App\Services\NewsletterAreaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterAreaController extends Controller
{
    public function __construct(private readonly NewsletterAreaService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/NewsletterAreas/Index', [
            'areas'  => $this->service->getPaginated(20, $request->input('q')),
            'filter' => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/NewsletterAreas/Form');
    }

    public function store(NewsletterAreaRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.newsletter-areas.index')
            ->with('success', 'Área criada com sucesso.');
    }

    public function edit(NewsletterArea $newsletterArea): Response
    {
        return Inertia::render('Admin/NewsletterAreas/Form', [
            'area' => $newsletterArea,
        ]);
    }

    public function update(NewsletterAreaRequest $request, NewsletterArea $newsletterArea): RedirectResponse
    {
        $this->service->update($newsletterArea, $request->validated());

        return redirect()->route('admin.newsletter-areas.index')
            ->with('success', 'Área atualizada com sucesso.');
    }

    public function destroy(NewsletterArea $newsletterArea): RedirectResponse
    {
        $this->service->delete($newsletterArea);

        return back()->with('success', 'Área excluída com sucesso.');
    }
}
