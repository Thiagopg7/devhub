<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\NewsletterArea;
use App\Models\Page;
use App\Models\Post;
use App\Models\Technology;
use Illuminate\Http\Request;

class ToggleController extends Controller
{
    private const ALLOWED_MODELS = [
        'post' => ['class' => Post::class,           'module' => 'posts'],
        'category' => ['class' => Category::class,       'module' => 'categories'],
        'block' => ['class' => Block::class,          'module' => 'blocks'],
        'menu_item' => ['class' => MenuItem::class,       'module' => 'menu'],
        'technology' => ['class' => Technology::class,     'module' => 'technologies'],
        'page' => ['class' => Page::class,           'module' => 'pages'],
        'newsletter_area' => ['class' => NewsletterArea::class, 'module' => 'newsletter_areas'],
    ];

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'model' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $config = self::ALLOWED_MODELS[strtolower($request->model)] ?? null;

        if (! $config) {
            return back()->with('toast', ['title' => 'Erro!', 'message' => 'Módulo inválido.', 'type' => 'error']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $item = $config['class']::find($request->id);

        if (! $item) {
            return back()->with('toast', ['title' => 'Erro!', 'message' => 'Item não encontrado.', 'type' => 'error']);
        }

        $item->is_active = $request->is_active;
        $item->save();

        return back();
    }
}
