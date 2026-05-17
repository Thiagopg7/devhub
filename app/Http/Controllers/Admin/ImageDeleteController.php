<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImageDeleteController extends Controller
{
    private const ALLOWED = [
        'post' => ['banner_image'],
        'page' => ['banner_image', 'main_image'],
    ];

    private const MODELS = [
        'post' => \App\Models\Post::class,
        'page' => \App\Models\Page::class,
    ];

    public function destroy(Request $request, FileUploadService $uploadService): RedirectResponse
    {
        $request->validate([
            'model' => 'required|string',
            'id'    => 'required',
            'field' => 'required|string',
        ]);

        $modelKey = strtolower($request->model);
        $field    = $request->field;

        $modelClass    = self::MODELS[$modelKey] ?? null;
        $allowedFields = self::ALLOWED[$modelKey] ?? [];

        if (!$modelClass || !in_array($field, $allowedFields, true)) {
            return back()->withErrors(['field' => 'Operação inválida.']);
        }

        $item = $modelClass::find($request->id);

        if (!$item || !$item->$field) {
            return back();
        }

        $uploadService->delete($item->$field);
        $item->update([$field => null]);

        return back();
    }
}
