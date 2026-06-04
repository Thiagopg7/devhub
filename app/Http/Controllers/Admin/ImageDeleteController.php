<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Post;
use App\Models\Technology;
use App\Models\Testimonial;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImageDeleteController extends Controller
{
    private const ALLOWED = [
        'post' => ['fields' => ['banner_image'],                          'class' => Post::class,        'module' => 'posts'],
        'page' => ['fields' => ['banner_image', 'main_image'],            'class' => Page::class,        'module' => 'pages'],
        'technology' => ['fields' => ['icon_image', 'screenshot_image'], 'class' => Technology::class,  'module' => 'technologies'],
        'testimonial' => ['fields' => ['avatar_image'],                   'class' => Testimonial::class, 'module' => 'testimonials'],
    ];

    public function destroy(Request $request, FileUploadService $uploadService): RedirectResponse
    {
        $request->validate([
            'model' => 'required|string',
            'id' => 'required',
            'field' => 'required|string',
        ]);

        $modelKey = strtolower($request->model);
        $field = $request->field;

        $config = self::ALLOWED[$modelKey] ?? null;

        if (! $config || ! in_array($field, $config['fields'], true)) {
            return back()->with('toast', ['title' => 'Erro!', 'message' => 'Operação inválida.', 'type' => 'error']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $modelClass = $config['class'];

        $item = $modelClass::find($request->id);

        if (! $item || ! $item->$field) {
            return back();
        }

        $uploadService->delete($item->$field);
        $item->update([$field => null]);

        return back();
    }
}
