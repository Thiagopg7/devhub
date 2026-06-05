<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StackItemRequest;
use App\Models\StackItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StackItemController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('q');
        $status = $request->input('status');

        $stack = StackItem::ordered()
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->when($status !== null && $status !== '', fn ($q) => $q->where('is_active', $status === '1'))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Stack/Index', [
            'stack' => $stack,
            'filter' => $request->only('q', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Stack/Form');
    }

    public function store(StackItemRequest $request): RedirectResponse
    {
        StackItem::create($request->validated());

        return redirect()->route('admin.stack.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia criada com sucesso.', 'type' => 'success']);
    }

    public function edit(StackItem $stack): Response
    {
        return Inertia::render('Admin/Stack/Form', [
            'stackItem' => $stack,
        ]);
    }

    public function update(StackItemRequest $request, StackItem $stack): RedirectResponse
    {
        $stack->update($request->validated());

        return redirect()->route('admin.stack.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia atualizada com sucesso.', 'type' => 'success']);
    }

    public function destroy(StackItem $stack): RedirectResponse
    {
        $stack->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Tecnologia excluída com sucesso.', 'type' => 'success']);
    }
}
