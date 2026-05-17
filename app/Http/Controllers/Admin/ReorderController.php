<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReorderController extends Controller
{
    private const ALLOWED_MODELS = [
        'technology' => \App\Models\Technology::class,
        'menu_item'  => \App\Models\MenuItem::class,
    ];

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'model'          => 'required|string',
            'items'          => 'required|array|min:1',
            'items.*.id'     => 'required|integer',
            'items.*.order'  => 'required|integer|min:1',
        ]);

        $modelClass = self::ALLOWED_MODELS[strtolower($request->model)] ?? null;

        if (!$modelClass) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        foreach ($request->items as $item) {
            $modelClass::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }
}
