<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlockRequest;
use App\Models\Block;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BlockController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('q');

        $blocks = Block::orderBy('name')
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Blocks/Index', [
            'blocks' => $blocks,
            'filter' => $request->only('q'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blocks/Form');
    }

    public function store(BlockRequest $request)
    {
        try {
            Block::create($request->validated());

            return redirect()->route('admin.blocks.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Bloco criado com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar bloco', ['error' => $e->getMessage()]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao criar o bloco. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }

    public function edit(Block $block)
    {
        return Inertia::render('Admin/Blocks/Form', [
            'block' => $block,
        ]);
    }

    public function update(BlockRequest $request, Block $block)
    {
        try {
            $block->update($request->validated());

            return redirect()->route('admin.blocks.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Bloco atualizado com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar bloco', ['error' => $e->getMessage(), 'block_id' => $block->id]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao atualizar o bloco. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }

    public function destroy(Block $block)
    {
        try {
            $block->delete();

            return redirect()->route('admin.blocks.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Bloco excluído com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir bloco', ['error' => $e->getMessage(), 'block_id' => $block->id]);
            return redirect()->back()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao excluir o bloco. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }
}
