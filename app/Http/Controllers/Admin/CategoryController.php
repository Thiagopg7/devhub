<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        try {
            Category::create($request->validated());

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria criada com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar categoria', ['error' => $e->getMessage()]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao criar a categoria. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => $category,
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        try {
            $category->update($request->validated());

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria atualizada com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar categoria', ['error' => $e->getMessage(), 'category_id' => $category->id]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao atualizar a categoria. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }

    public function destroy(Category $category)
    {
        try {
            $category->delete();

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria excluída com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir categoria', ['error' => $e->getMessage(), 'category_id' => $category->id]);
            return redirect()->back()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao excluir a categoria. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }
}
