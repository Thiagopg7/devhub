<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TechnologyRequest;
use App\Models\Technology;
use App\Services\TechnologyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    public function __construct(private readonly TechnologyService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Technologies/Index', [
            'technologies' => $this->service->getPaginated(20, $request->input('q')),
            'filter'       => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Technologies/Form');
    }

    public function store(TechnologyRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.technologies.index')
            ->with('success', 'Tecnologia criada com sucesso.');
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Admin/Technologies/Form', [
            'technology' => $technology,
        ]);
    }

    public function update(TechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $this->service->update($technology, $request->validated());

        return redirect()->route('admin.technologies.index')
            ->with('success', 'Tecnologia atualizada com sucesso.');
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        $this->service->delete($technology);

        return back()->with('success', 'Tecnologia excluída com sucesso.');
    }
}
