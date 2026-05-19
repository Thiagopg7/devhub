<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReorderController extends Controller
{
    private const ALLOWED_MODELS = [
        'technology'      => ['class' => \App\Models\Technology::class,     'module' => 'technologies'],
        'menu_item'       => ['class' => \App\Models\MenuItem::class,       'module' => 'menu'],
        'newsletter_area' => ['class' => \App\Models\NewsletterArea::class, 'module' => 'newsletter_areas'],
    ];

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'model'         => 'required|string',
            'items'         => 'required|array|min:1',
            'items.*.id'    => 'required|integer',
            'items.*.order' => 'required|integer|min:1',
        ]);

        $config = self::ALLOWED_MODELS[strtolower($request->model)] ?? null;

        if (!$config) {
            return back()->withErrors(['model' => 'Módulo inválido.']);
        }

        abort_unless($request->user()?->can("{$config['module']}.edit"), 403);

        $modelClass = $config['class'];
        $table      = (new $modelClass)->getTable();

        DB::transaction(function () use ($table, $request) {
            foreach ($request->items as $item) {
                DB::table($table)
                    ->where('id', $item['id'])
                    ->update(['order' => $item['order']]);
            }
        });

        return back();
    }
}
