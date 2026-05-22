<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('q');

        $categories = Category::orderBy('name')
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filter'     => $request->only('q'),
        ]);
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
