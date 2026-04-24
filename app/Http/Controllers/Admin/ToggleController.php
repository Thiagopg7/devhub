<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class ToggleController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'model' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $modelClass = "App\\Models\\" . Str::studly($request->model);

        if (!class_exists($modelClass)) {
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

    public function updateSearchable(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'model' => 'required|string',
            'is_searchable' => 'required|boolean',
        ]);

        $modelClass = "App\\Models\\" . Str::studly($request->model);

        if (!class_exists($modelClass)) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        $item = $modelClass::find($request->id);

        if (!$item) {
            return back()->withErrors(['item' => 'Item não encontrado.']);
        }

        $item->is_searchable = $request->is_searchable;
        $item->save();

        return back();
    }

    public function updateInclusive(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'model' => 'required|string',
            'is_inclusive' => 'required|boolean',
        ]);

        $modelClass = "App\\Models\\" . Str::studly($request->model);

        if (!class_exists($modelClass)) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        $item = $modelClass::find($request->id);

        if (!$item) {
            return back()->withErrors(['item' => 'Item não encontrado.']);
        }

        $item->is_inclusive = $request->is_inclusive;
        $item->save();

        return back();
    }
}
