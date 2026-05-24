<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class MenuController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = Cache::remember('api.menu', 3600, function () {
            return MenuItem::active()
                ->roots()
                ->with(['children' => fn ($q) => $q->active()->orderBy('order')])
                ->orderBy('order')
                ->get();
        });

        return MenuItemResource::collection($items);
    }
}
