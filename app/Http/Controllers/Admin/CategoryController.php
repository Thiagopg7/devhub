<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('q');

        $categories = Category::orderBy('name')
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories'  => $categories,
            'filter'      => $request->only('q'),
            'trashedCount' => Category::onlyTrashed()->count(),
        ]);
    }

    public function trashed(): Response
    {
        return Inertia::render('Admin/Categories/Trashed', [
            'categories' => Category::onlyTrashed()
                ->with('deletedByUser:id,name')
                ->orderByDesc('deleted_at')
                ->paginate(20)
                ->through(fn ($c) => $c->makeVisible('deleted_at')),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        Category::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Categoria restaurada.', 'type' => 'success']);
    }

    public function purge(int $id): RedirectResponse
    {
        Category::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Categoria excluída permanentemente.', 'type' => 'success']);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Form');
    }

    public function store(CategoryRequest $request)
    {
        Category::create($request->validated());

        return redirect()->route('admin.categories.index')->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Categoria criada com sucesso.',
            'type'    => 'success',
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => $category,
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('admin.categories.index')->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Categoria atualizada com sucesso.',
            'type'    => 'success',
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Categoria excluída com sucesso.',
            'type'    => 'success',
        ]);
    }
}
