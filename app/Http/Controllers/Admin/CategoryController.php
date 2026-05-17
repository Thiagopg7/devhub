<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $this->categoryService->getPaginated(20, $request->input('q')),
            'filter'     => $request->only('q'),
            'toast'      => session('toast'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Form');
    }

    public function store(CategoryRequest $request)
    {
        try {
            $this->categoryService->create($request->validated());

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria criada com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Erro ao criar categoria: ' . $e->getMessage(),
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
            $this->categoryService->update($category, $request->validated());

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria atualizada com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Erro ao atualizar categoria: ' . $e->getMessage(),
                'type'    => 'error',
            ]);
        }
    }

    public function destroy(Category $category)
    {
        try {
            $this->categoryService->delete($category);

            return redirect()->route('admin.categories.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Categoria excluída com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Erro ao excluir categoria: ' . $e->getMessage(),
                'type'    => 'error',
            ]);
        }
    }
}
