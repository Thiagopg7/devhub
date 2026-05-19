<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
            $this->categoryService->update($category, $request->validated());

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
            $this->categoryService->delete($category);

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
