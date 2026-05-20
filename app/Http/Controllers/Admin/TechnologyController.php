<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TechnologyRequest;
use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('q');

        $technologies = Technology::ordered()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Technologies/Index', [
            'technologies' => $technologies,
            'filter'       => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Technologies/Form');
    }

    public function store(TechnologyRequest $request): RedirectResponse
    {
        Technology::create($request->validated());

        return redirect()->route('admin.technologies.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia criada com sucesso.', 'type' => 'success']);
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Admin/Technologies/Form', [
            'technology' => $technology,
        ]);
    }

    public function update(TechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $technology->update($request->validated());

        return redirect()->route('admin.technologies.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia atualizada com sucesso.', 'type' => 'success']);
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        $technology->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia excluída com sucesso.', 'type' => 'success']);
    }
}
