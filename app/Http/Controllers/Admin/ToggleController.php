<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ToggleController extends Controller
{
    private const ALLOWED_MODELS = [
        'post'       => \App\Models\Post::class,
        'category'   => \App\Models\Category::class,
        'menu_item'  => \App\Models\MenuItem::class,
        'technology' => \App\Models\Technology::class,
        'page'       => \App\Models\Page::class,
    ];

    private function resolveModel(string $model): ?string
    {
        return self::ALLOWED_MODELS[strtolower($model)] ?? null;
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'model' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $modelClass = $this->resolveModel($request->model);

        if (!$modelClass) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        $item = $modelClass::find($request->id);

        if (!$item) {
            return back()->withErrors(['item' => 'Item não encontrado.']);
        }

        $item->is_active = $request->is_active;
        $item->save();

        return back();
    }
}
