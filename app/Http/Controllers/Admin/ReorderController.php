<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\MenuItem;
use App\Models\NewsletterArea;
use App\Models\Technology;
use App\Support\ApiCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReorderController extends Controller
{
    private const ALLOWED_MODELS = [
        'event' => ['class' => Event::class,           'module' => 'events',           'tags' => [],                       'keys' => []],
        'technology' => ['class' => Technology::class,     'module' => 'technologies',     'tags' => [ApiCache::TECHNOLOGIES], 'keys' => []],
        'menu_item' => ['class' => MenuItem::class,       'module' => 'menu',             'tags' => [ApiCache::MENU],         'keys' => ['menu.shared']],
        'newsletter_area' => ['class' => NewsletterArea::class, 'module' => 'newsletter_areas', 'tags' => [],                       'keys' => ['newsletter_areas.active']],
    ];

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'model' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.order' => 'required|integer|min:1',
        ]);

        $config = self::ALLOWED_MODELS[strtolower($request->model)] ?? null;

        if (! $config) {
            return back()->with('toast', ['title' => 'Erro!', 'message' => 'Módulo inválido.', 'type' => 'error']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $modelClass = $config['class'];
        $table = (new $modelClass)->getTable();

        DB::transaction(function () use ($table, $request) {
            foreach ($request->items as $item) {
                DB::table($table)
                    ->where('id', $item['id'])
                    ->update(['order' => $item['order']]);
            }
        });

        if ($config['tags']) {
            ApiCache::flush(...$config['tags']);
        }

        foreach ($config['keys'] as $key) {
            Cache::forget($key);
        }

        return back();
    }
}
