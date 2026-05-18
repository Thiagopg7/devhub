<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImageDeleteController extends Controller
{
    private const ALLOWED = [
        'post' => ['fields' => ['banner_image'],                'class' => \App\Models\Post::class, 'module' => 'posts'],
        'page' => ['fields' => ['banner_image', 'main_image'],  'class' => \App\Models\Page::class, 'module' => 'pages'],
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

        $config = self::ALLOWED[$modelKey] ?? null;

        if (!$config || !in_array($field, $config['fields'], true)) {
            return back()->withErrors(['field' => 'Operação inválida.']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $modelClass = $config['class'];

        $item = $modelClass::find($request->id);

        if (!$item || !$item->$field) {
            return back();
        }

        $uploadService->delete($item->$field);
        $item->update([$field => null]);

        return back();
    }
}
