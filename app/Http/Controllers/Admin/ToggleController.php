<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ToggleController extends Controller
{
    private const ALLOWED_MODELS = [
        'post'            => ['class' => \App\Models\Post::class,           'module' => 'posts'],
        'category'        => ['class' => \App\Models\Category::class,       'module' => 'categories'],
        'menu_item'       => ['class' => \App\Models\MenuItem::class,       'module' => 'menu'],
        'technology'      => ['class' => \App\Models\Technology::class,     'module' => 'technologies'],
        'page'            => ['class' => \App\Models\Page::class,           'module' => 'pages'],
        'newsletter_area' => ['class' => \App\Models\NewsletterArea::class, 'module' => 'newsletter_areas'],
    ];

    public function update(Request $request)
    {
        $request->validate([
            'id'        => 'required',
            'model'     => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $config = self::ALLOWED_MODELS[strtolower($request->model)] ?? null;

        if (!$config) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $item = $config['class']::find($request->id);

        if (!$item) {
            return back()->withErrors(['item' => 'Item não encontrado.']);
        }

        $item->is_active = $request->is_active;
        $item->save();

        return back();
    }
}
